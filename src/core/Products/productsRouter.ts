// Import Controllers
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "./productsController";

// Import dependencies
import { Hono } from "hono";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createProductSchema, updateProductSchema } from "./products.schema";
import { cacheMiddleWare } from "@/middlewares/cacheMiddleware";

export const productsRouter = new Hono();

// Get all categories
productsRouter.get("/", cacheMiddleWare("max-age=3600"), getProducts);
// Get categrory by id
productsRouter.get("/:id", cacheMiddleWare("max-age=3600"), getProductById)

// Create a new category
productsRouter.post("/", zValidatorMiddleware(createProductSchema), createProduct);
// Update a category
productsRouter.put("/:id", zValidatorMiddleware(updateProductSchema), updateProduct);
// Delete a category
productsRouter.delete("/:id", deleteProduct);
