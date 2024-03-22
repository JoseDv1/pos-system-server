import { prisma } from "@/utils/prisma";
import { Provider } from "@prisma/client";
import type { Context } from "hono";


/**
 * Get Providers Controller function that returns all the providers from the database.
 * @param ctx 
 * @returns All the providers from the database
 */
export async function getProviders(ctx: Context) {
	// Get supplys query from database and return the result
	const { supplies } = ctx.req.query();

	const providers: Provider[] = await prisma.provider.findMany({
		include: {
			supplies: Boolean(supplies),
		},
	});

	if (!providers) {
		ctx.notFound();
	}

	return ctx.json(providers);
}

/**
 * Get Provider by ID Controller function that returns a provider from the database by its ID.
 * @param ctx 
 * @returns A provider from the database by its ID
 */
export async function getProviderById(ctx: Context) {
	const { id } = ctx.req.param();
	const { supplies } = ctx.req.query();

	const provider = await prisma.provider.findUnique({
		where: {
			id: id,
		},
		include: {
			supplies: Boolean(supplies),
		},
	});

	if (!provider) {
		ctx.notFound();
	}

	return ctx.json(provider);
}


/**
 * Create Provider Controller function that extract the address, name and supplyDays from the request body and create a new provider in the database.
 * @param ctx 
 * @returns The created provider or an error if the provider already exists or the name is not provided
 */
export async function createProvider(ctx: Context) {
	const body: Provider = await ctx.req.json();
	const { phone, name, supplyDays } = body

	// Validate the request body
	if (!phone || !name || !supplyDays) {
		return ctx.json({ error: "Missing required fields" }, 400);
	}

	// Check if the provider already exists
	const providerExists = await prisma.provider.findFirst({
		where: {
			name: name,
		},
	});

	if (providerExists) {
		return ctx.json({ error: "Provider already exists" }, 400);
	}

	const createdProvider = await prisma.provider.create({
		data: {
			phone,
			name,
			supplyDays,
		},
	});

	return ctx.json(createdProvider, 201);
}


/**
 * 	Update Provider Controller function that extract the address, name and supplyDays from the request body and update a provider in the database by its ID.
 * @param ctx 
 * @returns a provider updated or an error if the provider does not exist
 */
export async function updateProvider(ctx: Context) {
	const body: Provider = await ctx.req.json();
	const { id } = ctx.req.param();
	const { phone, name, supplyDays } = body;

	// Validate if almost one field is provided
	if (!phone && !name && !supplyDays) {
		return ctx.json({ error: "At least one field is required" }, 400);
	}

	// Check if the provider exists
	const providerExists = await prisma.provider.findUnique({
		where: {
			id: id,
		},
	});

	if (!providerExists) {
		return ctx.json({ error: "Provider not found" }, 404);
	}



	// Update the provider
	const updatedProvider = await prisma.provider.update({
		where: {
			id: id,
		},
		data: {
			phone,
			name,
			supplyDays,
		},
	});

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

	// Check if the provider exists
	const providerExists = await prisma.provider.findUnique({
		where: {
			id: id,
		},
	});

	if (!providerExists) {
		return ctx.json({ error: "Provider not found" }, 404);
	}

	// Delete the provider
	await prisma.provider.delete({
		where: {
			id: id,
		},
	});

	// Return the deleted provider
	return ctx.json(providerExists);
}
