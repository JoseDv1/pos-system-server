import { Context } from "hono";

export class ErrorNotFound extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = "ErrorNotFound";
		this.status = 404;
	}
}

export class ErrorBadRequest extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = "ErrorBadRequest";
		this.status = 400;
	}
}

export class ErrorUnauthorized extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = "ErrorUnauthorized";
		this.status = 401;
	}
}

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