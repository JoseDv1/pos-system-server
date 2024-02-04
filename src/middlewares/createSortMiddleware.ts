import type { Context, MiddlewareHandler, Next } from "hono";



/**
 * Create a middleware function that sorts the items from the database based on the sort query parameter
 * @param prismaModel Prisma model to query the items example: prisma.category
 * @param sortField Field to sort the items Example: "name", "title"
 * @returns Middleware function
 */
export function createSortMiddleware<T, K>(
	prismaModel: T,
	sortField: keyof K & string
): MiddlewareHandler {



	// Return the middleware function
	return async function (c: Context, next: Next) {
		// Get the sort query parameter from the request
		const query = c.req.query();
		const { sort } = query;
		// If the sort query parameter is provided in the request URL then sort the items
		if (sort) {
			// Validate the sort query parameter
			if (sort !== "asc" && sort !== "desc") {
				return c.json({ error: "Invalid sort value" }, 400);
			}

			const sortedItems = await (prismaModel as any).findMany({
				orderBy: { [sortField]: sort === "asc" ? "asc" : "desc" },
			});

			// Return the sorted items and stop the execution of the next middleware
			return c.json(sortedItems);

		};

		// Continue the execution of the next middleware if the sort query parameter is not provided
		await next();
	}
}