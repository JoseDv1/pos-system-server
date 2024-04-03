import { createProvider, deleteProvider, getProviderById, getProviders, updateProvider } from "./providersController";
import { Hono } from "hono";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createProviderSchema, updateProviderSchema } from "./providers.schema";

export const providerRouter = new Hono();

// Get all providers
providerRouter.get("/", getProviders);

// Get provider by id
providerRouter.get("/:id", getProviderById);

// Create a new provider
providerRouter.post("/", zValidatorMiddleware(createProviderSchema), createProvider);

// Update a provider
providerRouter.put("/:id", zValidatorMiddleware(updateProviderSchema), updateProvider);

// Delete a provider
providerRouter.delete("/:id", deleteProvider);
