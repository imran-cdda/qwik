import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
//#region src/pages/api/crm/index.ts
var crm_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	PUT: () => PUT
});
var customers = [{
	id: "1",
	name: "Acme Corp",
	email: "contact@acme.com",
	phone: "555-0100",
	company: "Acme Corporation"
}, {
	id: "2",
	name: "TechStart Inc",
	email: "info@techstart.io",
	phone: "555-0101",
	company: "TechStart Inc"
}];
async function GET({ request }) {
	const id = new URL(request.url).searchParams.get("id");
	if (id) {
		const customer = customers.find((c) => c.id === id);
		return customer ? new Response(JSON.stringify(customer), { status: 200 }) : new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
	}
	return new Response(JSON.stringify(customers), { status: 200 });
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
//#region \0virtual:astro:page:src/pages/api/crm/index@_@ts
var page = () => crm_exports;
//#endregion
export { page };
