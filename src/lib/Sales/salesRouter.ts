import { Hono } from "hono";
import { createSale, deleteSale, getSaleById, getSales, updateSale, markAllSalesAsPaidByClientController, markSaleAsPaidController, markSaleAsPendingController } from "./salesController"
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createSalesSchema, updateSalesSchema } from "./sales.schema"

export const salesRouter = new Hono();

// Get all sales
salesRouter.get("/", getSales);

// Get sale by id
salesRouter.get("/:id", getSaleById);

// Create a new sale
salesRouter.post("/", zValidatorMiddleware(createSalesSchema), createSale);

// Update a sale 
salesRouter.put("/:id", zValidatorMiddleware(updateSalesSchema), updateSale);
salesRouter.put("/:id/paid", markSaleAsPaidController);
salesRouter.put("/:id/pending", markSaleAsPendingController);



// Update Status By Client
salesRouter.put("/paid/:clientId", markAllSalesAsPaidByClientController);

// Delete a sale
salesRouter.delete("/:id", deleteSale);

