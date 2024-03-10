import { prisma } from "@/lib/prisma";
import { deleteProductById, findProducts, insertProduct, updateProductById } from "@/services/productsServices";
import { Product } from "@prisma/client";
import { Context } from "hono";


/**
 * Get Products Controller function that returns all the products from the database.
 * @param c Context parameter from Hono
 * @returns return all the products from the database
 */
export async function getProducts(c: Context) {

	// Get all products from the database
	const products = await findProducts();

	// Return all the products
	return c.json(products);
}

/**
 *  Get Product by ID Controller function that returns a product from the database by its ID.
 * @param c 
 * @returns 
 */
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
	// get the data from the request body
	const body: Product = await c.req.json();

	// Create a new product in database
	const product = await insertProduct(body);

	// Response with the created product
	return c.json(product, 201);
}


/**
 * Get Product Controller function that extract the id from the request parameters and return the product from the database.
 * @param c Context parameter from Hono
 * @returns return the updated product from the database
 */
export async function updateProduct(c: Context) {
	const { id } = c.req.param();
	const body: Product = await c.req.json();

	const updatedProduct = await updateProductById(id, body);

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

	// Delete the product from the database
	const deletedProduct = await deleteProductById(id);

	return c.json(deletedProduct);
}