import { prisma } from "@/lib/prisma";
import { deleteCategoryById, findCategories, findCategoryById, insertCategory, updateCategory } from "@/services/categoriesServices";
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

	// Get the categories from the database
	const categories = await findCategories(products);


	// Return all the categories
	return c.json(categories);
}

/**
 * Get Category by ID Controller function that returns a category from the database by its ID.
 * @param c Context parameter from Hono
 * @returns return the category from the database by its ID
 */
export async function getCategoryById(c: Context) {
	// Get the id from the request parameters
	const { id } = c.req.param();
	const { products } = c.req.query();

	// Get the category from the database
	const category = await findCategoryById(id, products);

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
	const data: Category = await c.req.json();

	// Create the category in the database
	const category = await insertCategory(data);

	// Response with the created category
	return c.json(category, 201);
}

/**
 * Get Category Controller function that extract the id from the request parameters and return the category from the database.
 * @param c Context parameter from Hono
 * @returns return the updated category from the database
 */
export async function putCategory(c: Context) {

	// Get the id from the request parameters and the name and description from the request body
	const { id } = c.req.param();
	const data: Category = await c.req.json();

	// Update the category in the database
	const updatedCategory = await updateCategory(id, data);


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

	const deletedCategory = await deleteCategoryById(id);

	return c.json(deletedCategory);
}