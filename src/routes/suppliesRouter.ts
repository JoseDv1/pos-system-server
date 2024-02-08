import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import { createSupply, deleteSupply, getSupplies, getSupplyById, updateSupply } from "@/controllers/suppliesController";
import type { Supply, Prisma } from "@prisma/client";

export const suppliesRouter = new Hono();

// Get all supplies
suppliesRouter.get("/", createSortMiddleware<Prisma.SupplyDelegate, Supply>(prisma.supply, "date"), getSupplies);
// Get supply by id
suppliesRouter.get("/:id", getSupplyById);
// Create a new supply
suppliesRouter.post("/", createSupply);
// Update a supply
suppliesRouter.put("/:id", updateSupply);
// Delete a supply
suppliesRouter.delete("/:id", deleteSupply);

