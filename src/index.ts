/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
interface ENV {
	EXTERNAL_API_KEY?: string;
	D1_DB?: D1Database;
}

export default {
	// @ts-ignore
	async fetch(request: Request, env :ENV): Promise<Response> {
		// Authentication
		const AUTH_HEADER_KEY = "X-API-KEY";
		const API_KEY = env.EXTERNAL_API_KEY;
		const userApiKey = request.headers.get(AUTH_HEADER_KEY);
		const isValidApiKey = userApiKey === API_KEY;

		const isFromCf = request.cf?.asOrganization === 'Cloudflare';
		const corsHeaders = getBaseHeader();

		// Handle CORS preflight request (OPTIONS)
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,  // No content
				headers: corsHeaders,
			});
		}

		// Check if the API key is valid
		if (!isValidApiKey && !isFromCf) {
			// Incorrect key supplied. Reject the request.
			return new Response("Sorry, you have supplied an invalid key6!", {
				status: 403,
				headers: corsHeaders
			});
		}

		// BEGIN API config
		const { pathname } = new URL(request.url);
		const db = env.D1_DB;

		if (!db) {
			return new Response("DB not found!", {
				headers: corsHeaders
			});
		}

		// API WITH GET METHOD
		if (request.method === 'GET') {
			let apiResult = null;

			if (pathname === "/api/menu_version") {
				// Get menu data changed version
				const queryResult = await db.prepare(
					"SELECT * FROM version"
				).first();
				apiResult = {
					version: queryResult?.version,
					updated_at: queryResult?.updated_at
				};
			}

			// List categories
			if (pathname === "/api/categories") {
				const queryResult = await db.prepare(
					"SELECT * FROM categories"
				).all();

				apiResult = queryResult.results;
			}

			// List products
			if (pathname === "/api/products") {
				const queryResult = await db.prepare(
					"SELECT * FROM products"
				).all();

				apiResult = queryResult.results;
			}

			// List options (duplicated with products, may need correction)
			if (pathname === "/api/options") {
				const queryResult = await db.prepare(
					"SELECT * FROM options"
				).all();

				apiResult = queryResult.results;
			}

			corsHeaders.set('Content-Type', 'application/json');
			return new Response(JSON.stringify(apiResult), {
				headers: corsHeaders
			});
		}
	},
} satisfies ExportedHandler<Env>;

function getBaseHeader(): Headers {
	const newHeaders = new Headers();

	// Set CORS headers for the main request response
	newHeaders.set('Access-Control-Allow-Origin', '*');  // Allow all origins, modify for security
	newHeaders.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
	newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY, Authorization');

	return newHeaders;
}
