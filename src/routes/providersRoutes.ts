import { createProvider, deleteProvider, getProviderById, getProviders, updateProvider } from "@/controllers/providersController";
import { prisma } from "@/lib/prisma";
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import { Hono } from "hono";

export const providerRoutes = new Hono();

providerRoutes.get("/", createSortMiddleware(prisma.provider, "name"), getProviders);
providerRoutes.get("/:id", getProviderById);
providerRoutes.post("/", createProvider);
providerRoutes.put("/:id", updateProvider);
providerRoutes.delete("/:id", deleteProvider);
