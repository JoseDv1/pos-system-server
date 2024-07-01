import { type MiddlewareHandler } from "hono";
export function cacheMiddleWare(cacheControl: string): MiddlewareHandler {
	return async function (ctx, next) {
		// Set the cache control header
		ctx.header('Cache-Control', cacheControl);
		await next();
	}
}