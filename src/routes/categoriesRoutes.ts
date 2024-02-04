// Import Controllers
import { createCategory, deleteCategory, getCategories, updateCategory, getCategoryById } from "@/controllers/categoriesController";
// Import middlewares
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";


// Import types
import type { Category, Prisma } from "@prisma/client";

// Import dependencies
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";


export const categoriesRouter = new Hono();

// get all categories
categoriesRouter.get("/", createSortMiddleware<Prisma.CategoryDelegate, Category>(prisma.category, "name"), getCategories);
// Get categrory by id
categoriesRouter.get("/:id", getCategoryById)
// Create a new category
categoriesRouter.post("/", createCategory);
// Update a category
categoriesRouter.put("/:id", updateCategory);
// Delete a category
categoriesRouter.delete("/:id", deleteCategory);
