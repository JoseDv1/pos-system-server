import { createProvider, deleteProvider, getProviderById, getProviders, updateProvider } from "./providersController";
import { Hono } from "hono";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createProviderSchema, updateProviderSchema } from "./providers.schema";
import { cacheMiddleWare } from "@/middlewares/cacheMiddleware";

export const providerRouter = new Hono();

// Get all providers
providerRouter.get("/", cacheMiddleWare("max-age=3600"), getProviders);

// Get provider by id
providerRouter.get("/:id", cacheMiddleWare("max-age=3600"), getProviderById);

// Create a new provider
providerRouter.post("/", zValidatorMiddleware(createProviderSchema), createProvider);

// Update a provider
providerRouter.put("/:id", zValidatorMiddleware(updateProviderSchema), updateProvider);

// Delete a provider
providerRouter.delete("/:id", deleteProvider);
