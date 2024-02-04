import { createCategory, getCategories } from "@/controllers/categoriesController";
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import { prisma } from "@/lib/prisma";
import type { Category, Prisma } from "@prisma/client";
import { Hono } from "hono";

export const categoriesRouter = new Hono();

// get all categories
categoriesRouter.get("/", createSortMiddleware<Prisma.CategoryDelegate, Category>(prisma.category, "name"), getCategories);

// Create a new category
categoriesRouter.post("/", createCategory);