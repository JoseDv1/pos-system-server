import { prisma } from "@/lib/prisma";
import { findProducts, findUncategorizedProducts } from "@/services/productsServices";
import { Product } from "@prisma/client";
import { Context } from "hono";


/**
 * Get Products Controller function that returns all the products from the database.
 * @param c Context parameter from Hono
 * @returns return all the products from the database
 */
export async function getProducts(c: Context) {
	const { category } = c.req.query();

	// Get all uncategorized products from the database
	if (category === "null") {

		// Get all uncategories products from the database
		const products: Array<Product> = await findUncategorizedProducts();

		if (!products) {
			c.notFound();
		}
		// Return all the products
		return c.json(products);

	}

	// Get all products from the database
	const products = await findProducts({
		category
	});

	if (!products) {
		c.notFound();
	}

	// Return all the products
	return c.json(products);
}

export async function getProductById(c: Context) {
	// Get the id from the request parameters
	const { id } = c.req.param();

	// Get the product by id
	const product = await prisma.product.findUnique({
		where: { id: id },
		include: {
			category: true
		}
	});

	// If the model does not exist, return an error
	if (!product) {
		return c.notFound();
	}

	// Return the product
	return c.json(product);
}


/**
 * Create Product Controller function that extract the name and description from the request body and create a new product in the database.
 * @param c  Context parameter from Hono
 * @returns return the created product or an error if the product already exists or the name is not provided
 */
export async function createProduct(c: Context) {
	// Get the name from the request body
	const body: Product = await c.req.json();
	const { name, categoryId, price, stock } = body;


	// Validate the fields
	if (!name || !categoryId || !price) {
		return c.json({ error: "All fields are required" }, 400);
	}

	// Check if the product already exists
	const existingProduct = await prisma.product.findFirst({
		where: { name, categoryId, price, stock },
	});

	// If the product already exists, return an error
	if (existingProduct) {
		return c.json({ error: "Product already exists" }, 400);
	}

	// Chech if the category exists
	const category = await prisma.category.findUnique({
		where: { id: categoryId }
	});

	// If the category does not exists, return an error
	if (!category) {
		return c.json({ error: "Category not found" }, 404);
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

	// Response with the created product
	return c.json(product, 201);
}


/**
 * Get Product Controller function that extract the id from the request parameters and return the product from the database.
 * @param c Context parameter from Hono
 * @returns return the updated product from the database
 */
export async function updateProduct(c: Context) {

	// Get the id from the request parameters and the name and description from the request body
	const { id } = c.req.param();
	const body: Product = await c.req.json();
	const { name, price, stock, categoryId } = body;

	// Check is almost one field is provided
	if (!name && !price && !stock && !categoryId) {
		return c.json({ error: "At least one field is required" }, 400);
	}

	// Check if the product already exists
	const findProduct = await prisma.product.findUnique({
		where: {
			id
		},
	});

	// If the product does not exists, return an error
	if (!findProduct) {
		return c.notFound();
	}

	// if the object is the same, return the object
	if (findProduct.name === name &&
		findProduct.price === price &&
		findProduct.stock === stock &&
		findProduct.categoryId === categoryId
	) {
		return c.json(findProduct);
	}

	// Update the product in database
	const updatedProduct = await prisma.product.update({
		where: { id },
		data: {
			name,
			categoryId,
			id,
			price,
			stock,
		},
		include: {
			category: true
		}
	});

	// Response with the updated product
	return c.json(updatedProduct);
}

/**
 * Get Product Controller function that extract the id from the request parameters and return the product from the database.
 * @param c Context parameter from Hono
 * @returns return the deleted product from the database
 */
export async function deleteProduct(c: Context) {
	const { id } = c.req.param();

	const product = await prisma.product.findUnique({
		where: { id },
	});

	if (!product) {
		return c.notFound();
	}

	const deletedProduct = await prisma.product.delete({
		where: { id },
		include: {
			category: true
		}
	});

	return c.json(deletedProduct);
}