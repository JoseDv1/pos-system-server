import { prisma } from "@/utils/prisma";
import { Context } from "hono";
import { ProductsOnSupply, Supply } from "@prisma/client";
import { createSupplyService, deleteSupplyService, findSupplies, findSupplyById, updateSupplyService } from "./suppliesService";


/**
 * Get Supplies Controller function that returns all the supplies from the database.
 * @param ctx Context parameter from Hono
 * @returns return all the supplies from the database
 */
export async function getSupplies(ctx: Context) {
	// Get all supplies
	const supplies = await findSupplies();
	return ctx.json(supplies);
}

/**
 * Get Supply by ID Controller function that returns a supply from the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the supply from the database by its ID
 */
export async function getSupplyById(ctx: Context) {
	const { id } = ctx.req.param();
	const supply = await findSupplyById(id);
	return ctx.json(supply);
}

/**
 * Create Supply Controller function that extract the name and description from the request body and create a new supply in the database.
 * @param ctx Context parameter from Hono
 * @returns return the created supply or an error if the supply already exists or the name is not provided
 */
export async function createSupply(ctx: Context) {
	const body = ctx.get("validatedData")
	const createdSupply = await createSupplyService(body);
	return ctx.json(createdSupply);
}

/**
 * Update Supply Controller function that updates a supply in the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the updated supply or an error if the supply does not exist
 */
export async function updateSupply(ctx: Context) {
	const { id } = ctx.req.param();
	const body = ctx.get("validatedData")
	const updatedSupply = await updateSupplyService(id, body);
	return ctx.json(updatedSupply);
}

/**
 * Delete Supply Controller function that deletes a supply from the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the deleted supply or an error if the supply does not exist
 */
export async function deleteSupply(ctx: Context) {
	const { id } = ctx.req.param();
	const supply = await deleteSupplyService(id);
	return ctx.json(supply);
}



