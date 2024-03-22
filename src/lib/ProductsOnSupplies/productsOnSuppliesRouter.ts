import { Hono } from "hono";
import { deleteProductOnSupply, getProductsOnSupplyById, postProductsOnSupply, putProductOnSupply, getProductsOnSupply } from "./productsOnSuppliesController";

export const productsOnSupplyRouter = new Hono();


// Get All Products on Supply
productsOnSupplyRouter.get("/", getProductsOnSupply);

// Get a Product on Supply by Id
productsOnSupplyRouter.get("/:productId", getProductsOnSupplyById);

// Insert a Product on Supply
productsOnSupplyRouter.post("/", postProductsOnSupply);

// Update a Product on Supply
productsOnSupplyRouter.put("/:productId", putProductOnSupply);

// Delete a Product on Supply
productsOnSupplyRouter.delete("/:productId", deleteProductOnSupply);


