// Import Controllers
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "@/controllers/productsController";

// Import middlewares
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";

// Import types
import type { Product, Prisma } from "@prisma/client";

// Import dependencies
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";


export const productsRouter = new Hono();

// get all categories
productsRouter.get("/", createSortMiddleware<Prisma.ProductDelegate, Product>(prisma.product, "name"), getProducts);
// Get categrory by id
productsRouter.get("/:id", getProductById)
// Create a new category
productsRouter.post("/", createProduct);
// Update a category
productsRouter.put("/:id", updateProduct);
// Delete a category
productsRouter.delete("/:id", deleteProduct);
