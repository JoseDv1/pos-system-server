import { getClients, createClient, deleteClient, getClientById, updateClient } from "./clientsController";
import { Hono } from "hono";
import { zValidorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createClientSchema, updateClientSchema } from "./clients.schema";

export const clientsRouter = new Hono();

// Get all clients
clientsRouter.get('/', getClients);

// Get client by id
clientsRouter.get('/:id', getClientById);

// Create a new client
clientsRouter.post('/', zValidorMiddleware(createClientSchema), createClient);

// Update a client
clientsRouter.put('/:id', zValidorMiddleware(updateClientSchema), updateClient);

// Delete a client
clientsRouter.delete('/:id', deleteClient);
