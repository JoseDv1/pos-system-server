import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import { Product } from "@prisma/client";



/**
 * Function to check if a product exists in the database by its id
 * @param productId 
 * @returns the product if it exists
 */
export async function checkIfProductExists(productId: string) {
	// Validate if the product exists
	const product = await prisma.product.findUnique({
		where: { id: productId }
	});

	if (!product) {
		throw new ErrorNotFound("Product not found 404");
	}

	return product;
}

/**
 * Function to get all products from the database including the category
 * @returns an array of products from the database
 */
export async function findProducts() {
	const products: Array<Product> = await prisma.product.findMany({
		include: {
			category: true
		}
	});
	if (!products) {
		throw new ErrorNotFound("Products not found");
	}
	return products;
}

/**
 * Function to get a product from the database by its id including the category
 * @param productId 
 * @returns 
 */
export async function findProduct(productId: string) {
	const product = await prisma.product.findUnique({
		where: { id: productId },
		include: {
			category: true
		}
	});

	if (!product) {
		throw new ErrorNotFound("Product not found");
	}

	return product;
}

/**
 * Function to create a new product in the database 
 * @param data Product data
 * @returns the new product created
 */
export async function insertProduct(data: Product) {
	const { name, categoryId, price, stock } = data;

	// Validate the fields
	if (!name || !categoryId || !price) {
		throw new ErrorBadRequest("Name, category and price are required");
	}

	// Check if the product already exists
	const existingProduct = await prisma.product.findFirst({
		where: { name, categoryId },
	});

	// If the product already exists, return an error
	if (existingProduct) {
		throw new ErrorBadRequest("Product already exists");
	}

	// Chech if the category exists
	const category = await prisma.category.findUnique({
		where: { id: categoryId }
	});

	// If the category does not exists, return an error
	if (!category) {
		throw new ErrorNotFound("Category not found");
	}

	// Create a new product in database
	const product = await prisma.product.create({
		data: {
			name, categoryId, price, stock
		},
		include: {
			category: {
				select: {
					name: true,
					description: true
				}
			}
		}
	});

	return product;
}

/**
 * Function to update a product in the database by its id
 * @param productId 
 * @param data 
 * @returns the updated product
 */
export async function updateProductById(productId: string, data: Product) {
	const { name, price, stock, categoryId } = data;

	// Check is almost one field is provided
	if (!name && !price && !categoryId && stock == undefined) {
		throw new ErrorBadRequest("At least one field is required");
	}

	// Check if the product already exists
	const findProduct = await prisma.product.findUnique({
		where: {
			id: productId
		},
	});

	// If the product does not exists, return an error
	if (!findProduct) {
		throw new ErrorNotFound("Product not found");
	}

	// if the object is the same, return the object
	if (findProduct.name === name &&
		findProduct.price === price &&
		findProduct.stock === stock &&
		findProduct.categoryId === categoryId
	) {
		return findProduct;
	}

	// Update the product in database
	const updatedProduct = await prisma.product.update({
		where: { id: productId },
		data: {
			name,
			categoryId,
			price,
			stock,
		},
		include: {
			category: true
		}
	});


	return updatedProduct;
}

/**
 * Function to delete a product in the database by its id
 * @param productId 
 * @returns the deleted product
 */
export async function deleteProductById(productId: string) {
	// Check if the product exists
	const product = await checkIfProductExists(productId);

	// Delete the product in database
	const deletedProduct = await prisma.product.delete({
		where: { id: productId }
	});

	return deletedProduct;
}