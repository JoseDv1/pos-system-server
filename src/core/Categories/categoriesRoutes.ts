// Import Controllers
import { createCategory, deleteCategory, getCategories, putCategory, getCategoryById } from "@/core/Categories/categoriesController";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { createCategorySchema, updateCategorySchema } from "@/core/Categories/categories.schema";

// Import dependencies
import { Hono } from "hono";
export const categoriesRouter = new Hono();

// Get all categories 
categoriesRouter.get("/", getCategories);
// Get categrory by id
categoriesRouter.get("/:id", getCategoryById)


// Create a new category
categoriesRouter.post("/", zValidatorMiddleware(createCategorySchema), createCategory);
// Update a category
categoriesRouter.put("/:id", zValidatorMiddleware(updateCategorySchema), putCategory);
// Delete a category
categoriesRouter.delete("/:id", deleteCategory); 
