import { getClients, createClient, deleteClient, getClientById, updateClient } from "@/controllers/clientsController";
import { prisma } from "@/lib/prisma";
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import type { Client, Prisma } from "@prisma/client";
import { Hono } from "hono";

export const clientsRouter = new Hono();

clientsRouter.get('/', createSortMiddleware<Prisma.ClientDelegate, Client>(prisma.client, "name"), getClients);
clientsRouter.get('/:id', getClientById);
clientsRouter.post('/', createClient);
clientsRouter.put('/:id', updateClient);
clientsRouter.delete('/:id', deleteClient);
