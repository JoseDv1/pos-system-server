import { prisma } from "@/utils/prisma";
import type { Context } from "hono";
import type { Client } from "@prisma/client";
import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { deleteClientService, findClientById, findClients, insertClient, updateClientService } from "./clientsServices";

/**
 * Get Clients Controller function that returns all the clients from the database.
 * @param ctx 
 * @returns All the clients from the database
 */
export async function getClients(ctx: Context) {
	const clients: Client[] = await findClients();
	return ctx.json(clients);
}

/**
 * Get Client by ID Controller function that returns a client from the database by its ID.
 * @param ctx
 * @returns A client from the database by its ID
 */
export async function getClientById(ctx: Context) {
	const { id } = ctx.req.param();
	const client = await findClientById(id);
	return ctx.json(client);
}

/**
 * Create Client Controller function that extract the name and email from the request body and create a new client in the database.
 * @param ctx Context param from Hono
 * @returns The created client or an error if the client already exists or the name is not provided
 */
export async function createClient(ctx: Context) {
	const body = await ctx.req.json();
	const insertedClient = await insertClient(body);
	return ctx.json(insertedClient, 201);
}

/**
 * Update Client Controller function that extract the name and email from the request body and update a client in the database.
 * @param ctx Context param from Hono
 * @returns The updated client or an error if the client does not exist
 */
export async function updateClient(ctx: Context) {
	const { id } = ctx.req.param();
	const body = await ctx.req.json();
	const client = await updateClientService(id, body)
	return ctx.json(client);
}

/**
 * Delete Client Controller function that delete a client from the database by its ID.
 * @param ctx Context param from Hono
 * @returns A message if the client was deleted or an error if the client does not exist
 */
export async function deleteClient(ctx: Context) {
	const { id } = ctx.req.param();
	const client = await deleteClientService(id);
	return ctx.json(client);
}