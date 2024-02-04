import { prisma } from "@/lib/prisma";
import { Context } from "hono";
import { Supply } from "@prisma/client";


/**
 * Get Supplies Controller function that returns all the supplies from the database.
 * @param ctx Context parameter from Hono
 * @returns return all the supplies from the database
 */
export async function getSupplies(ctx: Context) {
	const { products } = ctx.req.query();

	// Get all supplies
	const supplies: Supply[] = await prisma.supply.findMany(
		{
			include: {
				products: Boolean(products)
			}
		}
	);

	if (!supplies) {
		return ctx.json({ message: "No supplies found" }, 404);
	}

	return ctx.json(supplies);
}

/**
 * Get Supply by ID Controller function that returns a supply from the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the supply from the database by its ID
 */
export async function getSupplyById(ctx: Context) {
	const { id } = ctx.req.param();
	const { products } = ctx.req.query();

	const supply = await prisma.supply.findUnique({
		where: { id: id },
		include: {
			products: Boolean(products)
		}
	});

	if (!supply) {
		return ctx.json({ message: "Supply not found" }, 404);
	}

	return ctx.json(supply);
}

/**
 * Create Supply Controller function that extract the name and description from the request body and create a new supply in the database.
 * @param ctx Context parameter from Hono
 * @returns return the created supply or an error if the supply already exists or the name is not provided
 */
export async function createSupply(ctx: Context) {
	const body: Supply = await ctx.req.json();
	const { date, providerId, totalCost } = body;

	// Check if all the required fields are provided
	if (!date || !providerId || !totalCost) {
		return ctx.json({ error: "Date, providerId and totalCost are required" }, 400);
	}

	// Check if the provider exists
	const provider = await prisma.provider.findUnique({
		where: { id: providerId }
	});

	if (!provider) {
		return ctx.json({ error: "Provider not found" }, 404);
	}

	// Create the supply
	const supply = await prisma.supply.create({
		data: {
			date,
			providerId,
			totalCost
		}
	});

	return ctx.json(supply);
}

/**
 * Update Supply Controller function that updates a supply in the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the updated supply or an error if the supply does not exist
 */
export async function updateSupply(ctx: Context) {
	const { id } = ctx.req.param();
	const body: Supply = await ctx.req.json();
	const { date, providerId, totalCost } = body;

	// Check if the supply exists
	const supply = await prisma.supply.findUnique({
		where: { id: id }
	});

	if (!supply) {
		return ctx.json({ error: "Supply not found" }, 404);
	}


	// Update the supply
	const updatedSupply = await prisma.supply.update({
		where: { id: id },
		data: {
			date,
			providerId,
			totalCost
		}
	});

	return ctx.json(updatedSupply);
}

/**
 * Delete Supply Controller function that deletes a supply from the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the deleted supply or an error if the supply does not exist
 */
export async function deleteSupply(ctx: Context) {
	const { id } = ctx.req.param();

	// Check if the supply exists
	const supply = await prisma.supply.findUnique({
		where: { id: id }
	});

	if (!supply) {
		return ctx.json({ error: "Supply not found" }, 404);
	}

	// Delete the supply
	await prisma.supply.delete({
		where: { id: id }
	});

	return ctx.json(supply);
}