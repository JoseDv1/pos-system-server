import { Hono } from "hono";
import { deleteProductOnSupply, getProductsOnSupplyById, postProductsOnSupply, putProductOnSupply, getProductsOnSupply } from "./productsOnSuppliesController";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createProductOnSupplySchema, updateProductOnSupplySchema } from "./productsOnSupply.schema";
import { cacheMiddleWare } from "@/middlewares/cacheMiddleware";

export const productsOnSupplyRouter = new Hono();


// Get All Products on Supply
productsOnSupplyRouter.get("/", cacheMiddleWare("no-cache"), getProductsOnSupply);

// Get a Product on Supply by Id
productsOnSupplyRouter.get("/:productId", cacheMiddleWare("no-cache"), getProductsOnSupplyById);

// Insert a Product on Supply
productsOnSupplyRouter.post("/", zValidatorMiddleware(createProductOnSupplySchema), postProductsOnSupply);

// Update a Product on Supply
productsOnSupplyRouter.put("/:productId", zValidatorMiddleware(updateProductOnSupplySchema), putProductOnSupply);

// Delete a Product on Supply
productsOnSupplyRouter.delete("/:productId", deleteProductOnSupply);


