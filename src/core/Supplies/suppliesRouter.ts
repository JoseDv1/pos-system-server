import { Hono } from "hono";
import { createSupply, deleteSupply, getSupplies, getSupplyById, updateSupply } from "./suppliesController";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createSuppliesSchema, updateSuppliesSchema } from "./supplies.schema";
import { cacheMiddleWare } from "@/middlewares/cacheMiddleware";

export const suppliesRouter = new Hono();

// Get all supplies
suppliesRouter.get("/", cacheMiddleWare("no-cache"), getSupplies);
// Get supply by id
suppliesRouter.get("/:id", cacheMiddleWare("no-cache"), getSupplyById);
// Create a new supply
suppliesRouter.post("/", zValidatorMiddleware(createSuppliesSchema), createSupply);
// Update a supply
suppliesRouter.put("/:id", zValidatorMiddleware(updateSuppliesSchema), updateSupply);
// Delete a supply
suppliesRouter.delete("/:id", deleteSupply);

