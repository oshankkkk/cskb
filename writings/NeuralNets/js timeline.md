js was built for netscape in 1990 something and it was a small client side scripting language. ECMA (European Computer Manufacturing Association) made js the new standard for a lanugage to run in the browser, Ecmascript. Netscape got lost in the dot com boom thing and the browser was open sourced as firefox.
As the browsers and js started to get more features new specs was made. This is the ES version number thing in js. the version of the ECMAScript spec that js implements. 
Micromedia made action script which then was built into ES4? idk 
What was a AJAX? it made SPAs possible but what was it?? was it a js lib? a blog post?
Js runtime = js engine? 
Internet was becoming the more common and js was used a lot and everyone was noticing that it was slow af. Then that time google made chrome, so they made there own js implementation and instead of making it a interpter they made a jit compiler. This was called v8 and was fast af boi.
Now since js was fast, very common and had a lot of features ppl wanted to run js code in the OS. So they made nodejs.
Then we got ES6 which was really important i think thats where you get typecript idk??
JS was now own by oracle i think.
Stuff like action script got bought or deprecated?
what happened jquerry, I wanna know how the history when from here on to 2026. all the details in the correct timeline. all of the js stuff that happend ALL OF IT.

---
**1995** — Brendan Eich writes JS for Netscape Navigator in ~10 days. Originally called Mocha, then LiveScript, renamed JavaScript as a marketing move riding on Java's hype (Sun was a Netscape partner). Not related to Java technically at all.

**1996** — Microsoft reverse-engineers it as JScript for IE3. Now two incompatible implementations exist. Netscape hands JS to ECMA to standardize (partly to dodge a trademark fight with Sun over "Java"). Result: **ECMAScript**, the spec. JS/JScript/later ActionScript are all *implementations* of that spec.

**1997** — ECMA-262 published, ES1.

**1999** — ES3. Big one for the era — regex, try/catch, better strings. This stayed the baseline for a decade because ES4 blew up.

**Early-mid 2000s** — **Macromedia** (not Micromedia) makes **ActionScript** for Flash. AS2/AS3 tracked drafts of the proposed **ES4** — an ambitious overhaul (classes, static types, modules, generators). TC39 fought over it for years (Doug Crockford was a famous holdout) and it was **abandoned in 2008**. That work got scaled back into what became ES5.

**1999→2005 — AJAX**: not a library, not a blog post that *invented* anything technically — it's a **named pattern**. Microsoft built `XMLHttpRequest` in 1999 for Outlook Web Access. Other browsers adopted it. In 2005, Jesse James Garrett wrote a blog post giving the *existing* technique (XHR + JS updating the DOM without a full page reload) a catchy name: Asynchronous JavaScript and XML. Gmail and Google Maps had already been doing this — the post just named and popularized it. This is what made SPA-style UX viable.

**2006** — jQuery (John Resig). Browsers' DOM/event/AJAX APIs were wildly inconsistent across vendors at this point — jQuery's whole value was papering over that. Became near-ubiquitous.

**2008** — Chrome ships with **V8**. First JIT compiler for JS (compiles hot code to native machine code instead of pure tree-walking interpretation). Massive perf jump, kicks off a real engine arms race (Firefox's TraceMonkey → later SpiderMonkey improvements, Safari's JavaScriptCore/Nitro).

**2009** — ES5 (JSON built-in, strict mode, `Array.map/filter/forEach`). Same year: **Ryan Dahl builds Node.js** on V8 — event loop + non-blocking I/O lets JS run server-side/on the OS instead of just in a browser tab.

**2010** — npm launches for Node.

**2009–2012** — **TypeScript**, built by Microsoft (Anders Hejlsberg, of C#/Delphi fame), released 2012. Correction: this is **not part of ES6** and predates it. Totally separate Microsoft project — a superset that adds static types, compiles ("transpiles") down to plain JS.

**2010–2013** — Framework wars start: Backbone (2010), AngularJS (2010, Google), **React** (2013, Facebook — introduced JSX + virtual DOM diffing).

**2014** — Vue.js (Evan You, ex-Google, essentially "what if Angular but simpler").

**2015** — **ES6/ES2015**, the landmark release: `let`/`const`, arrow functions, class syntax (sugar over prototypes), Promises, modules (`import`/`export`), template literals, destructuring, generators. After this TC39 moves to **yearly releases** — ES2016, ES2017 (added `async`/`await`), and so on straight through to ES2026 today.

**2015–2016** — Angular rewritten from scratch as Angular 2+ (TypeScript-based, basically unrelated to AngularJS under the hood).

**2016** — Yarn (npm alternative), Next.js (React + SSR).

**2017** — WebAssembly becomes a web standard — not JS, but a bytecode format that runs alongside JS at near-native speed, callable from JS.

**Flash/ActionScript death** — mobile (no Flash on iOS, ever) plus HTML5 canvas/video killed it slowly through the 2010s. Adobe officially discontinued Flash Player end of **2020**, browsers blocked it Jan 2021. ActionScript died with it.

**jQuery's decline** — not a sudden death, just got hollowed out from both sides: browsers standardized their native APIs (`fetch`, `querySelector`, etc. — the exact inconsistencies jQuery existed to fix), and React/Vue/Angular took over the "build an app" use case jQuery was being stretched to cover. Still huge on legacy sites/WordPress, basically absent from new app dev.

**Oracle** — owns the "JavaScript" trademark today via the Sun Microsystems acquisition (2010). It's genuinely just a trivia/irony point — Oracle has never controlled the language or the spec. That's TC39 (a committee under Ecma International, made up of browser vendors, Google, Microsoft, Adobe, Salesforce, invited experts, etc.).

**2018–2020** — Ryan Dahl publicly regrets Node's early design mistakes ("10 Things I Regret About Node.js"), builds **Deno** as a fix — secure-by-default (permissions model), TS support built in, ES modules only. Deno 1.0 ships 2020.

**2022** — **Bun** (Jarred Sumner) — another all-in-one JS runtime/bundler/package manager, built on JavaScriptCore instead of V8, written in Zig, extremely fast startup.

**2020s, TypeScript** — goes from "nice to have" to the default choice for any serious new JS codebase.

**2025–2026 (where we are now)** — Node itself added **native TypeScript support** (type-stripping, no `ts-node`/`tsx`/build step needed) in response to Bun/Deno competition — landed experimental in Node 22, unflagged in 23, default in 24 (current LTS). Under the hood it strips type annotations via a module called `amaro` and hands plain JS to V8 — note it's *type erasure*, not type-checking, so `tsc` is still used in CI for actual type safety. Bun and Deno remain viable alternatives for specific niches (Bun for tooling/CLI speed, Deno for edge/security-constrained scripts). All three engines — V8 (Chrome/Node/Edge), SpiderMonkey (Firefox), JavaScriptCore (Safari/Bun) — are still independently maintained and racing each other on perf.

That's the whole arc: Netscape → ECMA standardization → the AS/ES4 detour → AJAX naming an existing hack → jQuery patching browser chaos → V8 making JS fast → Node putting it on servers → the framework wars → ES6 modernizing the language → TS becoming the norm → Deno/Bun forcing Node to catch up.

---
**Module systems** (the boring but load-bearing part): CommonJS (`require`/`module.exports`) was Node's original system, 2009. AMD (RequireJS) was the browser-side async answer around the same time. UMD tried to be both. ES Modules (`import`/`export`) were *specified* in ES6/2015 but took years to actually land — Node didn't get stable native ESM support until Node 12/13 (~2019-2020). This is why so much tooling exists just to reconcile these systems.

**Bundlers/build tools** — this is its own arms race:
- Grunt/Gulp (2012ish) — early task runners
- Browserify (2011) — let you `require()` in the browser
- **Webpack** (2012/2014) — became the dominant bundler for a decade, powerful but notoriously complex config
- **Babel** (2014, originally "6to5") — transpiles new syntax down to old, is what let people write ES6+ while still supporting old browsers
- Rollup (2015) — ES-module-native, tree-shaking, became the standard for bundling *libraries*
- Parcel (2017) — zero-config alternative
- esbuild (2020, Go) — stupidly fast bundler/transpiler by rewriting in a compiled language instead of JS
- **Vite** (2020, Evan You again) — dev server that serves native ES modules directly during dev (no bundling needed) + uses esbuild/Rollup under the hood for prod builds. Instant HMR. This is now the default — Vite has ~98% developer satisfaction vs Webpack's decline in the latest surveys, and new projects overwhelmingly pick it, with Vite achieving a 98% satisfaction rate while webpack shows far more negative sentiment.
- swc (Rust) — faster Babel alternative
- Turbopack (Vercel/Rust) — Webpack successor, used by Next.js
- Rolldown/Oxc (Rust, under the "VoidZero" effort by Evan You) — becoming Vite's internal production bundler, with early adopters reporting build times dropping from 2.5 minutes to 40 seconds

**Package managers**: npm (2010) → Bower (2012, frontend-specific, now dead) → **Yarn** (2016, Facebook — fixed npm's early lockfile/speed problems, npm caught up later) → pnpm (content-addressable storage, huge disk-space savings, popular now).

**Component frameworks beyond React/Vue/Angular**:
- Ember (2011) — older, still alive, mostly legacy enterprise
- **Svelte** (2016, Rich Harris) — a *compiler*, not a runtime library — ships almost no framework code, compiles your components to vanilla JS. Tiny bundles, highest developer satisfaction in surveys.
- SolidJS (2018) — fine-grained reactivity, no virtual DOM, React-like syntax
- Alpine.js — jQuery-spirit-in-2026: sprinkle reactivity directly into HTML attributes, no build step, pairs with server-rendered pages
- htmx — not really "a JS framework," lets you drive interactivity via HTML attributes + server responses, part of a broader "maybe SPAs were a mistake sometimes" backlash

**Meta-frameworks** (SSR/SSG on top of the component libs): **Next.js** (2016, Vercel) for React, Nuxt for Vue, SvelteKit for Svelte, Remix (2021) for React, Astro (2021 — "islands architecture," ships zero JS by default for content sites). Next.js is now basically the default way people start React projects.

**State management** (React world specifically): Flux (2014, Facebook's pattern) → **Redux** (2015, Dan Abramov) dominated for years → Context API got built into React itself (2018) reduced the need for Redux in simpler apps → newer lighter libs (Zustand, Jotai) and TanStack Query (server-state caching) took over a lot of what Redux used to do.

**Backend/server frameworks** (Node world): **Express** (2010) was the dominant minimal framework forever. Koa (from the Express creators, more modern async model). **NestJS** (2017) — Angular-inspired, TypeScript-first, opinionated structure for larger apps. Fastify — performance-focused Express alternative. Hono — lightweight, runtime-agnostic (runs on Node, Deno, Bun, *and* edge platforms like Cloudflare Workers with the same code).

**Runtimes, current standing**: Node still dominates production, but the numbers are notably split now — Node sits around 90% usage, with Bun around 21% and Deno around 11% (people mix and match by use case). Deno 2.0 walked back some of its early "no npm, no node_modules" purism and added npm compatibility to reduce ecosystem friction. Bun's pitch is speed — startup time, install time, built-in bundler/test-runner/SQLite. Node responded to both by shipping native TypeScript support and a built-in test runner itself.

**Testing/linting**: Jasmine/Mocha+Chai early on → **Jest** (Facebook) became the dominant test runner for years → Vitest (Vite-native) now often preferred in Vite projects for speed. Cypress/Playwright for end-to-end browser testing. ESLint became the standard linter; Prettier (2017) the standard formatter; Biome (Rust) is a newer combined linter+formatter chasing the same speed gains as esbuild/swc/Vite.

**Beyond the browser/server split**: React Native (2015) — write JS, render real native mobile UI. Electron (2013) — Chromium + Node bundled together for desktop apps (VS Code, Slack, Discord all run on it). Tauri — a lighter Rust-based Electron alternative. Cloudflare Workers (2017) and similar edge platforms run JS in V8 isolates directly at the network edge, no full Node runtime.

**Where 2026 actually sits**, per this year's surveys: React holds roughly 91% usage among developers who use a frontend framework at all, and React alone accounts for about 44.7% of all developer usage and powers over half of framework-using websites. Create React App was officially deprecated in 2025, with the React team now pointing people to Vite for SPAs or Next.js/React Router for full frameworks. TypeScript usage has hit the point where 40% of developers use it exclusively. And the newest wrinkle nobody could've predicted a few years back: nearly 29% of code being written in the ecosystem by late 2025 was AI-generated, up 45% year over year — which is itself now shaping framework choice, since AI tools generate React code more reliably simply because there's more React in their training data.

That's the whole map — front to back, 1995 to now.