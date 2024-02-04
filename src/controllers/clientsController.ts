import { prisma } from "@/lib/prisma";
import type { Context } from "hono";
import type { Client } from "@prisma/client";


/**
 * Get Clients Controller function that returns all the clients from the database.
 * @param ctx 
 * @returns All the clients from the database
 */
export async function getClients(ctx: Context) {
	const { sales } = ctx.req.query();
	const clients: Client[] = await prisma.client.findMany(
		{
			include: {
				sales: Boolean(sales),
			},
		}
	);

	if (!clients) {
		ctx.notFound();
	}

	return ctx.json(clients);
}

/**
 * Get Client by ID Controller function that returns a client from the database by its ID.
 * @param ctx
 * @returns A client from the database by its ID
 */
export async function getClientById(ctx: Context) {
	const { id } = ctx.req.param();
	const { sales } = ctx.req.query();
	const client = await prisma.client.findUnique(
		{
			where: {
				id: id,
			},
			include: {
				sales: Boolean(sales),
			},
		}
	);

	if (!client) {
		ctx.notFound();
	}

	return ctx.json(client);
}

/**
 * Create Client Controller function that extract the name and email from the request body and create a new client in the database.
 * @param ctx Context param from Hono
 * @returns The created client or an error if the client already exists or the name is not provided
 */
export async function createClient(ctx: Context) {
	const body: Client = await ctx.req.json();

	// Validate if the requires fields are provided
	if (!body.name || !body.email) {
		return ctx.json({ error: "Name and email are required" }, 400);
	}

	// Validate if the client already exists
	const clientExists = await prisma.client.findUnique({
		where: {
			email: body.email,
		},
	});

	if (clientExists) {
		return ctx.json({ error: "Client already exists" }, 400);
	}

	// Create the client
	const client = await prisma.client.create({
		data: body,
	});

	return ctx.json(client);
}

/**
 * Update Client Controller function that extract the name and email from the request body and update a client in the database.
 * @param ctx Context param from Hono
 * @returns The updated client or an error if the client does not exist
 */
export async function updateClient(ctx: Context) {
	const { id } = ctx.req.param();
	const body: Client = await ctx.req.json();

	// Check if the client exists
	const clientExists = await prisma.client.findUnique({
		where: {
			id: id,
		},
	});

	if (!clientExists) {
		return ctx.json({ error: "Client not found" }, 404);
	}


	// Validate if almost one field is provided
	if (!body.name && !body.email && body.address) {
		return ctx.json({ error: "At least one field is required" }, 400);
	}

	// Update the client
	const client = await prisma.client.update({
		where: {
			id: id,
		},
		data: body,
	});

	return ctx.json(client);
}

/**
 * Delete Client Controller function that delete a client from the database by its ID.
 * @param ctx Context param from Hono
 * @returns A message if the client was deleted or an error if the client does not exist
 */
export async function deleteClient(ctx: Context) {
	const { id } = ctx.req.param();

	// Check if the client exists
	const clientExists = await prisma.client.findUnique({
		where: {
			id: id,
		},
	});

	if (!clientExists) {
		return ctx.json({ error: "Client not found" }, 404);
	}



	// Delete the client
	const client = await prisma.client.delete({
		where: {
			id: id,
		},
	});

	return ctx.json({ message: "Client deleted" });
}