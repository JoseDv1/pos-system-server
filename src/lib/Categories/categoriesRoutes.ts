// Import Controllers
import { createCategory, deleteCategory, getCategories, putCategory, getCategoryById } from "@/lib/Categories/categoriesController";
import { zValidorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createCategorySchema, updateCategorySchema } from "@/lib/Categories/categories.schema";

// Import dependencies
import { Hono } from "hono";
export const categoriesRouter = new Hono();

// Get all categories 
categoriesRouter.get("/", getCategories);
// Get categrory by id
categoriesRouter.get("/:id", getCategoryById)


// Create a new category
categoriesRouter.post("/", zValidorMiddleware(createCategorySchema), createCategory);
// Update a category
categoriesRouter.put("/:id", zValidorMiddleware(updateCategorySchema), putCategory);
// Delete a category
categoriesRouter.delete("/:id", deleteCategory); 
