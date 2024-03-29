import { Hono } from "hono";
import { getProductsOnSale, getProductOnSale, postProductsOnSale, putProductOnSale, deleteProductOnSale } from "@/controllers/productsOnSaleController";

export const productsOnSaleRouter = new Hono();

// Get All Products on Sale
productsOnSaleRouter.get("/", getProductsOnSale);

// Get a Product on Sale by Id
productsOnSaleRouter.get("/:productId", getProductOnSale);

// Insert a Product on Sale
productsOnSaleRouter.post("/", postProductsOnSale);

// Update a Product on Sale
productsOnSaleRouter.put("/:productId", putProductOnSale);

// Delete a Product on Sale
productsOnSaleRouter.delete("/:productId", deleteProductOnSale);



