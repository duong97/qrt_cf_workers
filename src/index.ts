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
import route from './route/index';
import { ValidateResult } from './class/ValidateResult';

export default {
	// @ts-ignore
	async fetch(request: Request, env :Env): Promise<Response> {
		// Authentication
		const AUTH_HEADER_KEY = "X-API-KEY";
		const API_KEY = env.EXTERNAL_API_KEY;
		const userApiKey = request.headers.get(AUTH_HEADER_KEY);
		const isValidApiKey = userApiKey === API_KEY;

		const isFromCf = request.cf;
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
		const db = env.D1_DB;

		if (!db) {
			return new Response("DB not found!", {
				headers: corsHeaders
			});
		}

		// Routing
		const response = await route.routeConfig(request, env);
		if (response.success) {
			corsHeaders.set('Content-Type', 'application/json');

			// Validate error
			let responseStatus = 200;
			if (response.data instanceof ValidateResult && response.data.hasError()) {
				responseStatus = 400;
			}

			// Send response
			return new Response(JSON.stringify(response.data), {
				status: responseStatus,
				headers: corsHeaders
			});
		}

		// Not match any route
		return new Response("Invalid request!", {
			status: 404,
			headers: corsHeaders
		});
	},
} satisfies ExportedHandler<Env>;

function getBaseHeader(): Headers {
	const newHeaders = new Headers();

	// Set CORS headers for the main request response
	newHeaders.set('Access-Control-Allow-Origin', '*');  // Allow all origins, modify for security
	newHeaders.set('Access-Control-Allow-Methods', '*');
	newHeaders.set('Access-Control-Allow-Headers', '*');

	return newHeaders;
}
