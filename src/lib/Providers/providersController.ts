import { prisma } from "@/utils/prisma";
import { Provider } from "@prisma/client";
import type { Context } from "hono";
import { deleteProviderService, findProviderById, findProviders, insertProvider, updateProviderService } from "./providersServices";


/**
 * Get Providers Controller function that returns all the providers from the database.
 * @param ctx 
 * @returns All the providers from the database
 */
export async function getProviders(ctx: Context) {
	const providers = await findProviders();
	return ctx.json(providers);
}

/**
 * Get Provider by ID Controller function that returns a provider from the database by its ID.
 * @param ctx 
 * @returns A provider from the database by its ID
 */
export async function getProviderById(ctx: Context) {
	const { id } = ctx.req.param();
	const provider = await findProviderById(id);
	return ctx.json(provider);
}


/**
 * Create Provider Controller function that extract the address, name and supplyDays from the request body and create a new provider in the database.
 * @param ctx 
 * @returns The created provider or an error if the provider already exists or the name is not provided
 */
export async function createProvider(ctx: Context) {
	const data = ctx.get("validatedData")
	const createdProvider = await insertProvider(data)
	return ctx.json(createdProvider, 201);
}


/**
 * 	Update Provider Controller function that extract the address, name and supplyDays from the request body and update a provider in the database by its ID.
 * @param ctx 
 * @returns a provider updated or an error if the provider does not exist
 */
export async function updateProvider(ctx: Context) {
	const data = ctx.get("validatedData");
	const { id } = ctx.req.param();
	const updatedProvider = await updateProviderService(id, data);
	// Return the updated provider
	return ctx.json(updatedProvider);
}

/**
 * Delete Provider Controller function that delete a provider from the database by its ID.
 * @param ctx 
 * @returns The deleted provider or an error if the provider does not exist
 */
export async function deleteProvider(ctx: Context) {
	const { id } = ctx.req.param();
	const deletedProvider = await deleteProviderService(id);
	// Return the deleted provider
	return ctx.json(deletedProvider);
}
