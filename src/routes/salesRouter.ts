import { Hono } from "hono";
import { createSale, deleteSale, getSaleById, getSales, updateSale } from "@/controllers/salesController"


export const salesRouter = new Hono();

// Get all sales
salesRouter.get("/", getSales);

// Get sale by id
salesRouter.get("/:id", getSaleById);

// Create a new sale
salesRouter.post("/", createSale);

// Update a sale
salesRouter.put("/:id", updateSale);

// Delete a sale
salesRouter.delete("/:id", deleteSale);

