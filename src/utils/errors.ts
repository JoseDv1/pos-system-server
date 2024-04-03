import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

/**
 * Error NotFound class to handle 404 errors
 */
export class ErrorNotFound extends Error {
	status: StatusCode;
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
	status: StatusCode;
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
	status: StatusCode;
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

	if (error instanceof ZodError) {
		return ctx.json(
			error.errors.map((err) => {
				return { message: err.message, path: err.path.join(".") }
			}),
			400);
	}

	if (error instanceof PrismaClientValidationError) {
		const parseErrorMessage = error.message.split("\n").at(-1);
		return ctx.json({
			message: parseErrorMessage,
		}, 400);
	}

	if (error instanceof PrismaClientKnownRequestError) {
		const parseErrorMessage = error.message.split("\n").at(-1);
		return ctx.json({ error: parseErrorMessage }, 400);
	}

	return ctx.json({ error: error.message }, 500);
}