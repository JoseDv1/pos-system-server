import { Hono } from "hono";
import { createSupply, deleteSupply, getSupplies, getSupplyById, updateSupply } from "./suppliesController";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createSuppliesSchema, updateSuppliesSchema } from "./supplies.schema";

export const suppliesRouter = new Hono();

// Get all supplies
suppliesRouter.get("/", getSupplies);
// Get supply by id
suppliesRouter.get("/:id", getSupplyById);
// Create a new supply
suppliesRouter.post("/", zValidatorMiddleware(createSuppliesSchema), createSupply);
// Update a supply
suppliesRouter.put("/:id", zValidatorMiddleware(updateSuppliesSchema), updateSupply);
// Delete a supply
suppliesRouter.delete("/:id", deleteSupply);

