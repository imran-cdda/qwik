import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/erm/hr/index.ts
var hr_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	POST: () => POST,
	PUT: () => PUT
});
var employees = [{
	id: "1",
	name: "John Doe",
	email: "john@company.com",
	department: "Engineering",
	position: "Developer",
	hireDate: "2023-01-15"
}, {
	id: "2",
	name: "Jane Smith",
	email: "jane@company.com",
	department: "Marketing",
	position: "Manager",
	hireDate: "2022-06-01"
}];
async function GET({ request }) {
	const id = new URL(request.url).searchParams.get("id");
	if (id) {
		const emp = employees.find((e) => e.id === id);
		return emp ? new Response(JSON.stringify(emp), { status: 200 }) : new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
	}
	return new Response(JSON.stringify(employees), { status: 200 });
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
//#region \0virtual:astro:page:src/pages/api/erm/hr/index@_@ts
var page = () => hr_exports;
//#endregion
export { page };
