import { getClients, createClient, deleteClient, getClientById, updateClient } from "./clientsController";
import { Hono } from "hono";

export const clientsRouter = new Hono();

// Get all clients
clientsRouter.get('/', getClients);

// Get client by id
clientsRouter.get('/:id', getClientById);

// Create a new client
clientsRouter.post('/', createClient);

// Update a client
clientsRouter.put('/:id', updateClient);

// Delete a client
clientsRouter.delete('/:id', deleteClient);
