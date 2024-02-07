import { Hono } from "hono";
import { deleteProductOnSupply, getProductsOnSupplyById, postProductsOnSupply, putProductOnSupply, getProductsOnSupply } from "@/controllers/productsOnSuppliesController";

export const productsOnSupplyRouter = new Hono();


// Get All Products on Supply
productsOnSupplyRouter.get("/:supplyId", getProductsOnSupply);

// Get a Product on Supply by Id
productsOnSupplyRouter.get("/:supplyId/products/:productId", getProductsOnSupplyById);

// Insert a Product on Supply
productsOnSupplyRouter.post("/:supplyId", postProductsOnSupply);

// Update a Product on Supply
productsOnSupplyRouter.put("/:supplyId/products/:productId", putProductOnSupply);

// Delete a Product on Supply
productsOnSupplyRouter.delete("/:supplyId/products/:productId", deleteProductOnSupply);


