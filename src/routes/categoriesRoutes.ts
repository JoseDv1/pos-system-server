// Import Controllers
import { createCategory, deleteCategory, getCategories, putCategory, getCategoryById } from "@/controllers/categoriesController";
import { createCategorySchema } from "@/schemas/categories.schema";
import { zValidator } from "@hono/zod-validator";

// Import dependencies
import { Hono } from "hono";



export const categoriesRouter = new Hono();

// Get all categories 
categoriesRouter.get("/", getCategories);
// Get categrory by id
categoriesRouter.get("/:id", getCategoryById)


// Create a new category
categoriesRouter.post("/", zValidator("json", createCategorySchema), createCategory);
// Update a category
categoriesRouter.put("/:id", putCategory);
// Delete a category
categoriesRouter.delete("/:id", deleteCategory); 
