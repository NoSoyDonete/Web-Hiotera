import { useCallback, useEffect, useState } from "react";
import { Header, Footer } from "./components/HeaderFooter.jsx";
import HeroScene from "./components/HeroScene.jsx";
import LiboxScene from "./components/LiboxScene.jsx";
import MeteoScene from "./components/MeteoScene.jsx";
import CatalogSection from "./components/CatalogSection.jsx";
import {
  Marquee,
  StatementSection,
  ImpactSection,
  JourneySection,
  ClosingSection,
} from "./components/ContentSections.jsx";
import SignalSection from "./components/SignalSection.jsx";
import ContactDialog from "./components/ContactDialog.jsx";
import { usePageEffects } from "./hooks/usePageEffects.js";

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const { progressRef, cursorRef, ringRef } = usePageEffects();
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const prepareContact = useCallback(() => {
    setContactOpen(false);
    setNotice(
      "Consulta preparada en modo demostración. No se han enviado datos.",
    );
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timeout);
  }, [notice]);

  return (
    <>
      <div ref={progressRef} className="progress" aria-hidden="true" />
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <Header onContact={openContact} />
      <main>
        <HeroScene onContact={openContact} />
        <LiboxScene />
        <MeteoScene />
        <Marquee />
        <StatementSection />
        <SignalSection />
        <ImpactSection />
        <CatalogSection onContact={openContact} />
        <JourneySection />
        <ClosingSection onContact={openContact} />
      </main>
      <Footer />
      <ContactDialog
        open={contactOpen}
        onClose={closeContact}
        onPrepared={prepareContact}
      />
      <div
        className={`toast${notice ? " show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </>
  );
}
