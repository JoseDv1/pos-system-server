import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { Context } from "hono";


/**
 * Get Categories Controller function that returns all the categories from the database.
 * @param c Context parameter from Hono
 * @returns return all the categories from the database
 */
export async function getCategories(c: Context) {
	// Get products query from database and return the result
	const { products } = c.req.query();

	// Get all categories from the database
	const categories: Array<Category> = await prisma.category.findMany(
		{
			include: {
				products: Boolean(products),
			},
		}
	);

	if (!categories) {
		c.notFound();
	}
	// Return all the categories
	return c.json(categories);
}


export async function getCategoryById(c: Context) {
	// Get the id from the request parameters
	const { id } = c.req.param();
	const { products } = c.req.query();

	// Get the category by id
	const category = await prisma.category.findUnique({
		where: { id: id },
		include: {
			products: Boolean(products),
		},
	});

	// If the model does not exist, return an error
	if (!category) {
		return c.notFound();
	}

	// Return the category
	return c.json(category);

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


/**
 * Get Category Controller function that extract the id from the request parameters and return the category from the database.
 * @param c Context parameter from Hono
 * @returns return the updated category from the database
 */
export async function updateCategory(c: Context) {

	// Get the id from the request parameters and the name and description from the request body
	const { id } = c.req.param();
	const body: Category = await c.req.json();
	const { name, description } = body;

	// Validate the name or description
	if (!name && !description) {
		return c.json({ error: "Name or description is required" }, 400);
	}

	// Check if the category already exists
	const findCategory = await prisma.category.findUnique({
		where: {
			id
		},
	});

	// If the category does not exists, return an error
	if (!findCategory) {
		return c.notFound();
	}

	// if the object is the same, return the object
	if (findCategory.name === name && findCategory.description === description) {
		return c.json(findCategory);
	}

	// Update the category in database
	const updatedCategory = await prisma.category.update({
		where: { id },
		data: {
			name,
			description,
		},
	});

	// Response with the updated category
	return c.json(updatedCategory);
}

/**
 * Get Category Controller function that extract the id from the request parameters and return the category from the database.
 * @param c Context parameter from Hono
 * @returns return the deleted category from the database
 */
export async function deleteCategory(c: Context) {
	const { id } = c.req.param();

	const category = await prisma.category.findUnique({
		where: { id },
	});

	if (!category) {
		return c.notFound();
	}

	const deletedCategory = await prisma.category.delete({
		where: { id },
	});

	return c.json(deletedCategory);
}