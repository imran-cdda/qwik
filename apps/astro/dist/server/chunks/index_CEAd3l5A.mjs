import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/erm/financial/index.ts
var financial_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var invoices = [
	{
		id: "1",
		customerId: "c1",
		amount: 1e3,
		status: "paid",
		dueDate: "2024-01-15",
		description: "Website development"
	},
	{
		id: "2",
		customerId: "c2",
		amount: 2500,
		status: "pending",
		dueDate: "2024-02-01",
		description: "Marketing campaign"
	},
	{
		id: "3",
		customerId: "c3",
		amount: 750,
		status: "overdue",
		dueDate: "2023-12-20",
		description: "Logo design"
	},
	{
		id: "4",
		customerId: "c4",
		amount: 3200,
		status: "paid",
		dueDate: "2024-01-30",
		description: "SEO services"
	},
	{
		id: "5",
		customerId: "c5",
		amount: 1800,
		status: "pending",
		dueDate: "2024-02-15",
		description: "Social media management"
	}
];
async function GET({ request }) {
	const id = new URL(request.url).searchParams.get("id");
	if (id) {
		const invoice = invoices.find((i) => i.id === id);
		return invoice ? new Response(JSON.stringify(invoice), { status: 200 }) : new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
	}
	return new Response(JSON.stringify(invoices), { status: 200 });
}
async function POST({ request }) {
	const body = await request.json();
	const newInvoice = {
		id: String(Date.now()),
		...body
	};
	return new Response(JSON.stringify(newInvoice), { status: 201 });
}
//#endregion
//#region \0virtual:astro:page:src/pages/api/erm/financial/index@_@ts
var page = () => financial_exports;
//#endregion
export { page };
