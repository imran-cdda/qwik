import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, l as renderTemplate, y as createAstro } from "./server_Q1M3t7Yu.mjs";
import { t as createComponent } from "./compiler_BRfI-1QV.mjs";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region ../../packages/shared/src/api-client.ts
function createApiClient(config = {}) {
	const { apiKey } = config;
	async function request(endpoint, options = {}) {
		let url = endpoint;
		if (!endpoint.startsWith("http")) {
			const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4321";
			url = `${baseUrl.startsWith("https") ? "https" : "http"}://${baseUrl.replace(/^https?:\/\//, "")}${endpoint}`;
		}
		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...apiKey && { "Authorization": `Bearer ${apiKey}` },
				...options.headers
			}
		});
		if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
		return response.json();
	}
	return {
		get: (endpoint) => request(endpoint, { method: "GET" }),
		post: (endpoint, data) => request(endpoint, {
			method: "POST",
			body: JSON.stringify(data)
		}),
		put: (endpoint, data) => request(endpoint, {
			method: "PUT",
			body: JSON.stringify(data)
		}),
		delete: (endpoint) => request(endpoint, { method: "DELETE" })
	};
}
//#endregion
//#region ../../packages/erm/src/financial/index.ts
var api$3 = createApiClient({
	baseUrl: "",
	apiKey: ""
});
async function getInvoices() {
	return api$3.get("/api/erm/financial");
}
//#endregion
//#region ../../packages/erm/src/financial/components.tsx
function FinancialDashboard({ initialData = [] }) {
	const [invoices] = useState(initialData);
	return /* @__PURE__ */ jsxs("div", {
		className: "financial-dashboard",
		children: [/* @__PURE__ */ jsx("h2", { children: "Financial Dashboard" }), /* @__PURE__ */ jsx("div", {
			className: "invoice-list",
			children: invoices.map((invoice) => /* @__PURE__ */ jsxs("div", {
				className: "invoice-card",
				children: [
					/* @__PURE__ */ jsx("span", { children: invoice.id }),
					/* @__PURE__ */ jsxs("span", { children: ["$", invoice.amount] }),
					/* @__PURE__ */ jsx("span", {
						className: `status-${invoice.status}`,
						children: invoice.status
					})
				]
			}, invoice.id))
		})]
	});
}
//#endregion
//#region ../../packages/erm/src/hr/index.ts
var api$2 = createApiClient();
async function getEmployees() {
	return api$2.get("/api/erm/hr");
}
//#endregion
//#region ../../packages/erm/src/hr/components.tsx
function EmployeeList({ initialData = [] }) {
	const [employees] = useState(initialData);
	return /* @__PURE__ */ jsxs("div", {
		className: "employee-list",
		children: [/* @__PURE__ */ jsx("h2", { children: "Human Resources" }), /* @__PURE__ */ jsxs("table", { children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
			/* @__PURE__ */ jsx("th", { children: "Name" }),
			/* @__PURE__ */ jsx("th", { children: "Email" }),
			/* @__PURE__ */ jsx("th", { children: "Department" }),
			/* @__PURE__ */ jsx("th", { children: "Position" })
		] }) }), /* @__PURE__ */ jsx("tbody", { children: employees.map((emp) => /* @__PURE__ */ jsxs("tr", { children: [
			/* @__PURE__ */ jsx("td", { children: emp.name }),
			/* @__PURE__ */ jsx("td", { children: emp.email }),
			/* @__PURE__ */ jsx("td", { children: emp.department }),
			/* @__PURE__ */ jsx("td", { children: emp.position })
		] }, emp.id)) })] })]
	});
}
//#endregion
//#region ../../packages/erm/src/inventory/index.ts
var api$1 = createApiClient();
async function getProducts() {
	return api$1.get("/api/erm/inventory");
}
//#endregion
//#region ../../packages/erm/src/inventory/components.tsx
function InventoryDashboard({ initialData = [] }) {
	const [products] = useState(initialData);
	return /* @__PURE__ */ jsxs("div", {
		className: "inventory-dashboard",
		children: [/* @__PURE__ */ jsx("h2", { children: "Inventory Management" }), /* @__PURE__ */ jsx("div", {
			className: "product-grid",
			children: products.map((product) => /* @__PURE__ */ jsxs("div", {
				className: "product-card",
				children: [
					/* @__PURE__ */ jsx("h3", { children: product.name }),
					/* @__PURE__ */ jsxs("p", { children: ["SKU: ", product.sku] }),
					/* @__PURE__ */ jsxs("p", { children: ["Qty: ", product.quantity] }),
					/* @__PURE__ */ jsxs("p", { children: ["Price: $", product.price] })
				]
			}, product.id))
		})]
	});
}
//#endregion
//#region ../../packages/crm/src/actions.ts
var api = createApiClient();
async function getCustomers() {
	return api.get("/api/crm");
}
//#endregion
//#region ../../packages/crm/src/components.tsx
function CustomerList({ initialData = [] }) {
	const [customers] = useState(initialData);
	return /* @__PURE__ */ jsxs("div", {
		className: "customer-list",
		children: [/* @__PURE__ */ jsx("h2", { children: "Customer Management" }), /* @__PURE__ */ jsx("div", {
			className: "customer-grid",
			children: customers.map((customer) => /* @__PURE__ */ jsxs("div", {
				className: "customer-card",
				children: [
					/* @__PURE__ */ jsx("h3", { children: customer.name }),
					/* @__PURE__ */ jsx("p", { children: customer.company }),
					/* @__PURE__ */ jsx("p", { children: customer.email }),
					/* @__PURE__ */ jsx("p", { children: customer.phone })
				]
			}, customer.id))
		})]
	});
}
//#endregion
//#region ../../packages/engine/src/index.tsx
async function QwikEngine({ params }) {
	const slug = (params instanceof Promise ? await params : params).slug;
	const [packageName, pageName] = slug || [];
	let pageComponent = null;
	if (packageName === "erm") {
		if (pageName === "financial") {
			const data = await getInvoices();
			pageComponent = /* @__PURE__ */ jsx(FinancialDashboard, { initialData: data });
		} else if (pageName === "hr") {
			const data = await getEmployees();
			pageComponent = /* @__PURE__ */ jsx(EmployeeList, { initialData: data });
		} else if (pageName === "inventory") {
			const data = await getProducts();
			pageComponent = /* @__PURE__ */ jsx(InventoryDashboard, { initialData: data });
		}
	} else if (packageName === "crm") {
		if (pageName === "customers") {
			const data = await getCustomers();
			pageComponent = /* @__PURE__ */ jsx(CustomerList, { initialData: data });
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "qwik-engine",
		children: [/* @__PURE__ */ jsx("aside", {
			className: "qwik-sidebar",
			children: /* @__PURE__ */ jsxs("nav", { children: [/* @__PURE__ */ jsxs("div", {
				className: "qwik-package",
				children: [/* @__PURE__ */ jsx("h3", { children: "ERM" }), /* @__PURE__ */ jsxs("ul", { children: [
					/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
						href: "/admin/erm/financial",
						children: "Financial"
					}) }),
					/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
						href: "/admin/erm/hr",
						children: "Human Resources"
					}) }),
					/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
						href: "/admin/erm/inventory",
						children: "Inventory"
					}) })
				] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "qwik-package",
				children: [/* @__PURE__ */ jsx("h3", { children: "CRM" }), /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
					href: "/admin/crm/customers",
					children: "Customers"
				}) }) })]
			})] })
		}), /* @__PURE__ */ jsx("main", {
			className: "qwik-content",
			children: pageComponent || /* @__PURE__ */ jsxs("div", { children: ["Page not found: ", slug?.join("/")] })
		})]
	});
}
//#endregion
//#region src/pages/admin/[...slug].astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Component = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Component;
	const { slug } = Astro.params;
	const params = { slug: slug ? slug.split("/") : [] };
	return renderTemplate`${renderComponent($$result, "QwikEngine", QwikEngine, { "params": params })}`;
}, "C:/Users/mdimr/OneDrive/Desktop/project/qwik/apps/astro/src/pages/admin/[...slug].astro", void 0);
var $$file = "C:/Users/mdimr/OneDrive/Desktop/project/qwik/apps/astro/src/pages/admin/[...slug].astro";
var $$url = "/admin/[...slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/[...slug]@_@astro
var page = () => ____slug__exports;
//#endregion
export { page };
