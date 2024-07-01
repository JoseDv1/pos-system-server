// Import Controllers
import { createCategory, deleteCategory, getCategories, putCategory, getCategoryById } from "@/core/Categories/categoriesController";
import { zValidatorMiddleware } from "@/middlewares/zValidatorMiddleware";
import { cacheMiddleWare } from "@/middlewares/cacheMiddleware"
import { createCategorySchema, updateCategorySchema } from "@/core/Categories/categories.schema";

// Import dependencies
import { Hono } from "hono";
export const categoriesRouter = new Hono();

// Get all categories 
categoriesRouter.get("/", cacheMiddleWare("max-age=3600"), getCategories);
// Get categrory by id
categoriesRouter.get("/:id", cacheMiddleWare("max-age=3600"), getCategoryById)


// Create a new category
categoriesRouter.post("/", zValidatorMiddleware(createCategorySchema), createCategory);
// Update a category
categoriesRouter.put("/:id", zValidatorMiddleware(updateCategorySchema), putCategory);
// Delete a category
categoriesRouter.delete("/:id", deleteCategory); 
