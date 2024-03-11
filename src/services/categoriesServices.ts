import { ErrorBadRequest, ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";


/**
 * Validation Function to check if the category exists in the database by its id and return the category
 */
async function checkIfCategoryExists(categoryId: string) {
	// Validate if the category exists
	const category = await prisma.category.findUnique({
		where: { id: categoryId }
	});

	if (!category) {
		throw new ErrorNotFound("Category not found 404");
	}

	return category;
}

/**
 *  Function to get all categories from the database 
 * @param products if true, it will include all the products of each category
 * @returns an array of categories with or without the products
 */
export async function findCategories(products: string | undefined) {

	// Get the categories from the database
	const categories: Array<Category> = await prisma.category.findMany({
		include: {
			products: Boolean(products),
		},
	});

	if (!categories) {
		throw new ErrorNotFound("Categories not found");
	}

	return categories;
}

/**
 * Function to get a category by its id from the database
 * @param categoryId 
 * @param products 
 * @returns a category 
 */
export async function findCategoryById(categoryId: string, products: string | undefined) {
	const category = await prisma.category.findUnique({
		where: { id: categoryId },
		include: {
			products: Boolean(products),
		},
	});

	if (!category) {
		throw new ErrorNotFound("Category not found");
	}

	return category;
}

/**
 * Function to insert a new category in the database
 * @param data A category object with the name and optional description
 * @returns Created category in the db
 */
export async function insertCategory(data: Category) {

	// Validate the fields
	if (!data.name) {
		throw new ErrorBadRequest("Invalid input: name is required");
	}

	// Check if the category already exists
	const existingCategory = await prisma.category.findFirst({
		where: { name: data.name },
	});

	// If the category already exists, return an error
	if (existingCategory) {
		throw new ErrorBadRequest("Category already exists");
	}


	const category = await prisma.category.create({
		data,
	});

	return category;
}

/**
 * Function to update a category by its id in the database
 * @param categoryId 
 * @param data A category object with the data to update
 * @returns Updated category in the db
 */
export async function updateCategory(categoryId: string, data: Category) {
	await checkIfCategoryExists(categoryId);

	// Check if almost one field is being updated
	if (!data.name && !data.description) {
		throw new ErrorBadRequest("Invalid input: at least one field is required");
	}

	const updatedCategory = await prisma.category.update({
		where: { id: categoryId },
		data,
	});

	return updatedCategory;
}

/**
 * Function to delete a category by its id from the database
 * @param categoryId 
 * @returns Deleted category
 */
export async function deleteCategoryById(categoryId: string) {
	await checkIfCategoryExists(categoryId);

	const deletedCategory = await prisma.category.delete({
		where: { id: categoryId }
	});

	return deletedCategory;
}