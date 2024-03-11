import { Context } from "hono";

/**
 * Error NotFound class to handle 404 errors
 */
export class ErrorNotFound extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = "ErrorNotFound";
		this.status = 404;
	}
}

/**
 * Error BadRequest class to handle 400 errors
 */
export class ErrorBadRequest extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = "ErrorBadRequest";
		this.status = 400;
	}
}

/**
 * Error Unauthorized class to handle 401 errors
 */
export class ErrorUnauthorized extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = "ErrorUnauthorized";
		this.status = 401;
	}
}

/**
 * Error InternalServerError class to handle 500 errors
 */
export function handleError(error: Error, ctx: Context) {
	if (error instanceof ErrorNotFound) {
		return ctx.json({ error: error.message }, error.status);
	}

	if (error instanceof ErrorBadRequest) {
		return ctx.json({ error: error.message }, error.status);
	}

	if (error instanceof ErrorUnauthorized) {
		return ctx.json({ error: error.message }, error.status);
	}

	console.error(error);
	return ctx.json({ error: error.message }, 500);
}