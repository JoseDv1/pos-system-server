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

export const productsRouter = new Hono();

// Get all categories
productsRouter.get("/", getProducts);
// Get categrory by id
productsRouter.get("/:id", getProductById)

// Create a new category
productsRouter.post("/", zValidatorMiddleware(createProductSchema), createProduct);
// Update a category
productsRouter.put("/:id", zValidatorMiddleware(updateProductSchema), updateProduct);
// Delete a category
productsRouter.delete("/:id", deleteProduct);
