import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { Context } from "hono";


/**
 * Get Categories Controller function that returns all the categories from the database.
 * @param c Context parameter from Hono
 * @returns return all the categories from the database
 */
export async function getCategories(c: Context) {
	// Get all categories from the database
	const categories: Array<Category> = await prisma.category.findMany();

	if (!categories) {
		c.notFound();
	}

	// Return all the categories
	return c.json(categories);
}


/**
 * Create Category Controller function that extract the name and description from the request body and create a new category in the database.
 * @param c  Context parameter from Hono
 * @returns return the created category or an error if the category already exists or the name is not provided
 */
export async function createCategory(c: Context) {
	// Get the name from the request body
	const body: Category = await c.req.json();
	const { name, description } = body;

	// Validate the name
	if (!name) {
		return c.json({ error: "Name is required" }, 400);
	}

	// Check if the category already exists
	const existingCategory = await prisma.category.findFirst({
		where: { name },
	});

	// If the category already exists, return an error
	if (existingCategory) {
		return c.json({ error: "Category already exists" }, 400);
	}

	// Create a new category in database
	const category = await prisma.category.create({
		data: {
			name,
			description,
		},
	});

	// Response with the created category
	return c.json(category, 201);
}

