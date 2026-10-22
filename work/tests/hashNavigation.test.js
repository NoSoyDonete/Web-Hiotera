import test from "node:test";
import assert from "node:assert/strict";
import { installHashNavigation } from "../src/hashNavigation.js";

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, handler) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(handler);
    },
    removeEventListener(type, handler) {
      listeners.get(type)?.delete(handler);
    },
    emit(type, properties = {}) {
      const event = {
        button: 0,
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
        ...properties,
      };
      for (const handler of listeners.get(type) || []) handler(event);
      return event;
    },
    listenerCount() {
      return [...listeners.values()].reduce((sum, set) => sum + set.size, 0);
    },
  };
}

function environment({ hash = "#meteo", reduced = false } = {}) {
  let url = new URL(`https://hiotera.test/web/?demo=1${hash}`);
  let nextFrame = 0;
  let resolveFonts;
  const frames = new Map();
  const elements = new Map();
  const calls = [];
  const pushes = [];
  const observers = [];
  const window = {
    ...eventTarget(),
    scrollY: 0,
    get location() {
      return url;
    },
    history: {
      pushState(state, title, href) {
        pushes.push({ state, title, href });
        url = new URL(href, url);
      },
    },
    requestAnimationFrame(callback) {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
    matchMedia: () => ({ matches: reduced }),
    ResizeObserver: class {
      constructor(callback) {
        this.callback = callback;
        this.observed = [];
        this.disconnected = false;
        observers.push(this);
      }
      observe(element) {
        this.observed.push(element);
      }
      disconnect() {
        this.disconnected = true;
      }
    },
  };
  const main = {
    children: [],
    contains: (element) => main.children.includes(element),
  };
  const document = {
    ...eventTarget(),
    fonts: {
      ready: new Promise((resolve) => {
        resolveFonts = resolve;
      }),
    },
    getElementById: (id) => elements.get(id) || null,
    querySelector: (selector) => (selector === "main" ? main : null),
  };
  const addTarget = (id, top) => {
    const attributes = new Map();
    const element = {
      id,
      top,
      parentElement: main,
      hasAttribute: (name) => attributes.has(name),
      getAttribute: (name) => attributes.get(name) ?? null,
      setAttribute: (name, value) => attributes.set(name, value),
      focus(options) {
        document.activeElement = element;
        element.focusCalls = (element.focusCalls || 0) + 1;
        element.focusOptions = options;
      },
      contains: (other) => element === other,
      getBoundingClientRect: () => ({ top: element.top - window.scrollY }),
      scrollIntoView(options) {
        calls.push({ id, ...options });
        window.scrollY = element.top;
        window.emit("scroll");
      },
    };
    elements.set(id, element);
    main.children.push(element);
    return element;
  };
  addTarget("inicio", 0);
  addTarget("nodo", 1000);
  addTarget("meteo", 2000);
  addTarget("senal", 5000);
  return {
    window,
    document,
    elements,
    main,
    calls,
    pushes,
    observers,
    addTarget,
    install: () => installHashNavigation({ window, document }),
    flush() {
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(16);
    },
    resize({ stale = false } = {}) {
      for (const observer of [...observers]) {
        if (stale || !observer.disconnected) observer.callback([]);
      }
    },
    async fontsReady() {
      resolveFonts();
      await document.fonts.ready;
      await Promise.resolve();
    },
    hashChanged(hash) {
      url.hash = hash;
      window.emit("hashchange");
    },
    click(href, properties = {}, attributes = {}) {
      const attrs = { href, ...attributes };
      const link = {
        getAttribute: (name) => attrs[name] ?? null,
        hasAttribute: (name) => Object.hasOwn(attrs, name),
      };
      return document.emit("click", {
        target: {
          closest: (selector) => (selector === "a[href]" ? link : null),
        },
        ...properties,
      });
    },
    pendingFrames: () => frames.size,
  };
}

test("direct #meteo navigation waits for the mounted target and works before the lazy model loads", () => {
  const env = environment();
  const meteo = env.elements.get("meteo");
  env.elements.delete("meteo");
  const cleanup = env.install();
  assert.deepEqual(env.calls, []);
  env.elements.set("meteo", meteo);
  env.flush();
  assert.deepEqual(env.calls, [
    { id: "meteo", block: "start", behavior: "instant" },
  ]);
  assert.deepEqual(env.observers[0].observed, [
    env.main,
    ...env.main.children.slice(0, 2),
  ]);
  cleanup();
});

test("fonts and earlier section layout changes realign the target without reacting to programmatic scroll", async () => {
  const env = environment();
  const cleanup = env.install();
  env.flush();
  env.elements.get("meteo").top = 2200;
  await env.fontsReady();
  env.flush();
  assert.equal(env.window.scrollY, 2200);
  env.elements.get("meteo").top = 800;
  env.resize();
  env.flush();
  assert.equal(env.window.scrollY, 800);
  assert.equal(env.calls.length, 3);
  assert.ok(env.calls.every((call) => call.behavior === "instant"));
  env.resize();
  env.flush();
  assert.equal(
    env.calls.length,
    3,
    "a stable resize notification should not scroll again",
  );
  cleanup();
});

test("scroll intent cancels queued layout and font corrections", async (t) => {
  for (const [type, properties] of [
    ["wheel", {}],
    ["touchstart", {}],
    ["pointerdown", {}],
    ["keydown", { key: "PageDown" }],
  ]) {
    await t.test(type, async () => {
      const env = environment();
      const cleanup = env.install();
      env.flush();
      env.elements.get("meteo").top = 2200;
      env.resize();
      env.window.emit(type, properties);
      env.window.scrollY = 2400;
      await env.fontsReady();
      env.resize({ stale: true });
      env.flush();
      assert.equal(env.calls.length, 1);
      assert.equal(env.window.scrollY, 2400);
      env.hashChanged("#senal");
      env.flush();
      assert.equal(
        env.calls.at(-1).id,
        "senal",
        "a new navigation can restore after user intervention",
      );
      cleanup();
    });
  }
});

test("typing and handled navigation keys do not cancel restoration", async () => {
  const env = environment();
  const cleanup = env.install();
  env.flush();
  env.window.emit("keydown", {
    key: "ArrowDown",
    target: { tagName: "INPUT" },
  });
  env.window.emit("keydown", { key: " ", target: { isContentEditable: true } });
  env.window.emit("keydown", { key: "Home", defaultPrevented: true });
  env.window.emit("keydown", { key: "a" });
  env.elements.get("meteo").top = 2300;
  await env.fontsReady();
  env.flush();
  assert.equal(env.window.scrollY, 2300);
  cleanup();
});

test("a changed hash invalidates pending frames and old observer callbacks", async () => {
  const env = environment();
  const cleanup = env.install();
  env.flush();
  env.elements.get("meteo").top = 2500;
  env.resize();
  env.hashChanged("#senal");
  env.resize({ stale: true });
  env.flush();
  assert.deepEqual(
    env.calls.map((call) => call.id),
    ["meteo", "senal"],
  );
  env.elements.get("senal").top = 5200;
  await env.fontsReady();
  env.flush();
  assert.equal(env.calls.at(-1).id, "senal");
  assert.equal(env.window.scrollY, 5200);
  cleanup();
});

test("same-page links push history and scroll smoothly, including links to the same hash", async () => {
  const env = environment();
  const cleanup = env.install();
  env.flush();
  env.window.emit("pointerdown");
  const same = env.click("#meteo");
  assert.equal(same.defaultPrevented, true);
  assert.equal(env.pushes.length, 0);
  env.flush();
  assert.equal(env.calls.at(-1).behavior, "smooth");
  await env.fontsReady();
  env.resize();
  env.flush();
  assert.equal(
    env.calls.length,
    2,
    "stable layout must not interrupt smooth navigation",
  );
  const changed = env.click("https://hiotera.test/web/?demo=1#senal");
  assert.equal(changed.defaultPrevented, true);
  assert.equal(env.pushes.length, 1);
  assert.equal(env.window.location.hash, "#senal");
  env.flush();
  assert.deepEqual(env.calls.at(-1), {
    id: "senal",
    block: "start",
    behavior: "smooth",
  });
  cleanup();
});

test("reduced motion makes link navigation instant", () => {
  const env = environment({ reduced: true });
  const cleanup = env.install();
  env.flush();
  env.click("#senal");
  env.flush();
  assert.equal(env.calls.at(-1).behavior, "instant");
  cleanup();
});

test("modified, external, targeted, downloadable, and invalid links retain native behavior", () => {
  const env = environment();
  const cleanup = env.install();
  env.flush();
  const cases = [
    ["#senal", { button: 1 }],
    ["#senal", { ctrlKey: true }],
    ["#senal", { metaKey: true }],
    ["#senal", { shiftKey: true }],
    ["#senal", { altKey: true }],
    ["#senal", { defaultPrevented: true }],
    ["#senal", {}, { target: "_blank" }],
    ["#senal", {}, { target: "_self" }],
    ["#senal", {}, { download: "" }],
    ["https://other.test/web/?demo=1#senal"],
    ["/elsewhere?demo=1#senal"],
    ["?demo=2#senal"],
    ["#missing"],
    ["#%E0%A4%A"],
    ["#"],
    ["http://["],
  ];
  for (const [href, properties, attributes] of cases) {
    const event = env.click(href, properties, attributes);
    assert.equal(
      event.defaultPrevented,
      Boolean(properties?.defaultPrevented),
      href,
    );
  }
  env.flush();
  assert.equal(env.calls.length, 1);
  assert.equal(env.pushes.length, 0);
  cleanup();
});

test("empty, missing, and malformed initial fragments are safe; encoded IDs work", () => {
  for (const hash of ["", "#", "#missing", "#%E0%A4%A"]) {
    const env = environment({ hash });
    const cleanup = env.install();
    env.flush();
    assert.deepEqual(env.calls, [], hash);
    cleanup();
  }
  const env = environment({ hash: "#part%20name" });
  env.addTarget("part name", 6500);
  const cleanup = env.install();
  env.flush();
  assert.equal(env.calls[0].id, "part name");
  cleanup();
});

test("cleanup cancels pending work, stale observers, font promises, and listeners", async () => {
  const env = environment();
  const cleanup = env.install();
  env.flush();
  env.elements.get("meteo").top = 2300;
  env.resize();
  assert.equal(env.pendingFrames(), 1);
  cleanup();
  assert.equal(env.pendingFrames(), 0);
  env.resize({ stale: true });
  await env.fontsReady();
  env.hashChanged("#senal");
  env.flush();
  assert.equal(env.calls.length, 1);
  assert.equal(env.window.listenerCount(), 0);
  assert.equal(env.document.listenerCount(), 0);
  assert.ok(env.observers.every((observer) => observer.disconnected));
});

test("a StrictMode-style setup, cleanup, and setup has no stale restoration", async () => {
  const env = environment();
  env.install()();
  const cleanup = env.install();
  env.flush();
  assert.equal(env.calls.length, 1);
  env.elements.get("meteo").top = 2300;
  await env.fontsReady();
  env.flush();
  assert.equal(env.calls.length, 2);
  cleanup();
});

test("fragment navigation moves keyboard focus once without replacing existing tabindex", async () => {
  const env = environment();
  const meteo = env.elements.get("meteo");
  const cleanup = env.install();
  env.flush();
  assert.equal(env.document.activeElement, meteo);
  assert.equal(meteo.getAttribute("tabindex"), "-1");
  assert.deepEqual(meteo.focusOptions, { preventScroll: true });
  meteo.top += 100;
  await env.fontsReady();
  env.flush();
  assert.equal(meteo.focusCalls, 1);
  const signal = env.elements.get("senal");
  signal.setAttribute("tabindex", "0");
  env.click("#senal");
  env.flush();
  assert.equal(env.document.activeElement, signal);
  assert.equal(signal.getAttribute("tabindex"), "0");
  cleanup();
});
