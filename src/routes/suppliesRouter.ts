import { Hono } from "hono";
import { createSupply, deleteSupply, getSupplies, getSupplyById, updateSupply } from "@/controllers/suppliesController";

export const suppliesRouter = new Hono();

// Get all supplies
suppliesRouter.get("/", getSupplies);
// Get supply by id
suppliesRouter.get("/:id", getSupplyById);
// Create a new supply
suppliesRouter.post("/", createSupply);
// Update a supply
suppliesRouter.put("/:id", updateSupply);
// Delete a supply
suppliesRouter.delete("/:id", deleteSupply);

