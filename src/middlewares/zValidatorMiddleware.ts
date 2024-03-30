import { Context, MiddlewareHandler, Next } from "hono";
import { AnyZodObject } from "zod";

export const zValidatorMiddleware = (schema: AnyZodObject): MiddlewareHandler => async (c: Context, next: Next) => {

	// Get The data from the request body
	const data = await c.req.json();

	// Validate the data
	const result = schema.safeParse(data);

	if (!result.success) {
		throw result.error;
	}

	c.set("validatedData", result.data);

	// Next function
	await next();
} 