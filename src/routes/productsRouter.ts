// Import Controllers
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "@/controllers/productsController";

// Import dependencies
import { Hono } from "hono";


export const productsRouter = new Hono();

// Get all categories
productsRouter.get("/", getProducts);
// Get categrory by id
productsRouter.get("/:id", getProductById)
// Create a new category
productsRouter.post("/", createProduct);
// Update a category
productsRouter.put("/:id", updateProduct);
// Delete a category
productsRouter.delete("/:id", deleteProduct);
