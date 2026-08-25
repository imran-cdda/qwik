import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderHead, f as addAttribute, l as renderTemplate, y as createAstro } from "./server_Q1M3t7Yu.mjs";
import { t as createComponent } from "./compiler_BRfI-1QV.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro.build");
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	return renderTemplate`<html lang="en"><head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>Astro</title>${renderHead($$result)}</head><body><h1>Astro</h1></body></html>`;
}, "C:/Users/mdimr/OneDrive/Desktop/project/qwik/apps/astro/src/pages/index.astro", void 0);
var $$file = "C:/Users/mdimr/OneDrive/Desktop/project/qwik/apps/astro/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
