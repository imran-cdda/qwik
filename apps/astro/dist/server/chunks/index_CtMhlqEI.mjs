import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
//#region src/pages/api/erm/inventory/index.ts
var inventory_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	PUT: () => PUT
});
var products = [
	{
		id: "1",
		name: "Laptop",
		sku: "TECH-001",
		quantity: 50,
		price: 999.99
	},
	{
		id: "2",
		name: "Mouse",
		sku: "TECH-002",
		quantity: 200,
		price: 29.99
	},
	{
		id: "3",
		name: "Keyboard",
		sku: "TECH-003",
		quantity: 150,
		price: 79.99
	}
];
async function GET({ request }) {
	const id = new URL(request.url).searchParams.get("id");
	if (id) {
		const product = products.find((p) => p.id === id);
		return product ? new Response(JSON.stringify(product), { status: 200 }) : new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
	}
	return new Response(JSON.stringify(products), { status: 200 });
}
async function POST({ request }) {
	const body = await request.json();
	return new Response(JSON.stringify({
		id: String(Date.now()),
		...body
	}), { status: 201 });
}
async function PUT({ request }) {
	const id = new URL(request.url).searchParams.get("id");
	if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
	const body = await request.json();
	return new Response(JSON.stringify({
		id,
		...body
	}), { status: 200 });
}
async function DELETE({ request }) {
	if (!new URL(request.url).searchParams.get("id")) return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
//#endregion
//#region \0virtual:astro:page:src/pages/api/erm/inventory/index@_@ts
var page = () => inventory_exports;
//#endregion
export { page };
