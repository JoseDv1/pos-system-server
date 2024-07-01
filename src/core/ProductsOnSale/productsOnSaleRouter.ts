import { Hono } from "hono";
import { getProductsOnSale, getProductOnSale, postProductsOnSale, putProductOnSale, deleteProductOnSale, addOneProductOnSale } from "./productsOnSaleController";
import { createProductsOnSaleSchema, updateProductsOnSaleSchema } from "./productsOnSale.schema";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { cacheMiddleWare } from "@/middlewares/cacheMiddleware";

export const productsOnSaleRouter = new Hono();

// Get All Products on Sale
productsOnSaleRouter.get("/", cacheMiddleWare("no-cache"), getProductsOnSale);

// Get a Product on Sale by Id
productsOnSaleRouter.get("/:productId", cacheMiddleWare("no-cache"), getProductOnSale);

// Insert a Product on Sale
productsOnSaleRouter.post("/", zValidatorMiddleware(createProductsOnSaleSchema), postProductsOnSale);

// Update a Product on Sale
productsOnSaleRouter.put("/:productId", zValidatorMiddleware(updateProductsOnSaleSchema), putProductOnSale);
productsOnSaleRouter.patch("/:productId/addOne", addOneProductOnSale)

// Delete a Product on Sale
productsOnSaleRouter.delete("/:productId", deleteProductOnSale);



