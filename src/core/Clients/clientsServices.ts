import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import { Client } from "@prisma/client";
import { string } from "zod";


/**
 * Find Clients Service function that returns all the clients from the database.
 * @returns All the clients from the database
 */
export const findClients = async () => {
	const clients: Client[] = await prisma.client.findMany(
		{
			include: {
				sales: true
			},
		}
	);


	return clients;
}


export const findClientById = async (id: string) => {
	const client = await prisma.client.findUnique(
		{
			where: {
				id: id,
			},
			include: {
				sales: true,
			},
		}
	);

	if (!client) {
		throw new ErrorNotFound("Client not found");
	}

	return client;
}

export const insertClient = async (data: Omit<Client, "id">) => {
	const insertedClient = await prisma.client.create({
		data
	});

	return insertedClient;
}
export const updateClientService = async (id: string, data: Omit<Partial<Client>, "id">) => {
	// Check if the client exists
	const clientExists = await prisma.client.findUnique({
		where: {
			id: id,
		},
	});

	if (!clientExists) {
		throw new ErrorNotFound("Client not found");
	}

	// Validate if almost one field is provided
	if (!data.name && !data.email && data.address && !data.active) {
		throw new ErrorBadRequest("At least one field is required");
	}

	// Update the client
	const client = await prisma.client.update({
		where: {
			id: id,
		},
		data
	});

	return client;
}
export const deleteClientService = async (id: string) => {
	// Check if the client exists
	const clientExists = await prisma.client.findUnique({
		where: {
			id: id,
		},
	});

	if (!clientExists) {
		throw new ErrorNotFound("Client not found");
	}

	// Delete the client
	const client = await prisma.client.delete({
		where: {
			id: id,
		},
	});

	return client;
}