import { createProvider, deleteProvider, getProviderById, getProviders, updateProvider } from "@/controllers/providersController";
import { prisma } from "@/lib/prisma";
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import type { Prisma, Provider } from "@prisma/client";
import { Hono } from "hono";

export const providerRouter = new Hono();

providerRouter.get("/", createSortMiddleware<Prisma.ProviderDelegate, Provider>(prisma.provider, "name"), getProviders);
providerRouter.get("/:id", getProviderById);
providerRouter.post("/", createProvider);
providerRouter.put("/:id", updateProvider);
providerRouter.delete("/:id", deleteProvider);
