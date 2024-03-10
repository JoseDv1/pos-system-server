import { Context } from "hono";
import { ProductsOnSupply } from "@prisma/client";
import { findProductOnSupply, findProductsOnSupply, insertProductsOnSupply, removeProductOnSupply, updateProductOnSupply } from "@/services/productsOnSupplyServices";


/**
 * Get Products On Supply Controller function that returns all the products on the supply from the database.
 * @param ctx Context parameter from Hono
 * @returns return all the products on the supply from the database
 */
export async function getProductsOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();

	// Get all products on the supply
	const productsOnSupply = await findProductsOnSupply(supplyId);
	return ctx.json(productsOnSupply);

}

/**
 * Get Product On Supply by ID Controller function that returns a product on the supply from the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the product on the supply from the database by its ID
 */
export async function getProductsOnSupplyById(ctx: Context) {

	const { supplyId, productId } = ctx.req.param();

	// Get the product on the supply
	const productOnSupply = await findProductOnSupply(supplyId, productId);
	return ctx.json(productOnSupply);
}


/**
 * Create Products On Supply Controller function that extract the products from the request body and create a new product on the supply in the database.
 * @param ctx Context parameter from Hono
 * @returns return the created product on the supply or an error if the product already exists or the name is not provided
 */
export async function postProductsOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();
	const body: ProductsOnSupply[] = await ctx.req.json();

	// Insert all products on the supply
	const productOnSupply = await insertProductsOnSupply(supplyId, body);


	// Return the product that was inserted on the supply
	return ctx.json(productOnSupply);

}

/**
 * Update Product On Supply Controller function that extract the products from the request body and update a product on the supply in the database.
 * @param ctx Context parameter from Hono
 * @returns return the updated product on the supply from the database
 */
export async function putProductOnSupply(ctx: Context) {

	const { supplyId, productId } = ctx.req.param();
	const body: ProductsOnSupply = await ctx.req.json();

	const updatedProductOnSupply = await updateProductOnSupply(supplyId, productId, body);


	return ctx.json(updatedProductOnSupply);
}

/**
 * Delete Product On Supply Controller function that delete a product on the supply from the database by its ID.
 * @param ctx Context parameter from Hono
 * @returns return the deleted product on the supply from the database
 */
export async function deleteProductOnSupply(ctx: Context) {
	const { supplyId, productId } = ctx.req.param();

	// Delete the product on the supply
	const deletedProductOnSupply = await removeProductOnSupply(supplyId, productId);

	return ctx.json(deletedProductOnSupply);
}




