import { createProvider, deleteProvider, getProviderById, getProviders, updateProvider } from "@/controllers/providersController";
import { Hono } from "hono";

export const providerRouter = new Hono();

// Get all providers
providerRouter.get("/", getProviders);

// Get provider by id
providerRouter.get("/:id", getProviderById);

// Create a new provider
providerRouter.post("/", createProvider);

// Update a provider
providerRouter.put("/:id", updateProvider);

// Delete a provider
providerRouter.delete("/:id", deleteProvider);
