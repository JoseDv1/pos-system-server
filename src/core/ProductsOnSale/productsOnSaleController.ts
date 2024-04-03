import { Context } from "hono";
import { ProductsOnSales } from "@prisma/client";
import { addOne, deleteProductsOnSale, findProductsOnSale, findProductsOnSaleByProductId, insertProductsOnSale, updateProductsOnSale } from "./productsOnSaleServices"


/**
 * Retrieves the products on sale for a given sale ID.
 *
 * @param c - The Hono context object.
 * @returns A JSON response containing the products on sale.
 */
export async function getProductsOnSale(c: Context) {
	const { saleId } = c.req.param();
	const productsOnSale = await findProductsOnSale(saleId);
	return c.json(productsOnSale);
}

/**
 * Retrieves the products on sale for a given sale ID and product ID.
 * @param c - The Hono context object.
 * @returns A JSON response containing the products on sale.
 */
export async function getProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const productOnSale = await findProductsOnSaleByProductId(saleId, productId);
	return c.json(productOnSale);
}

/**
 * Inserts a new product on the sale for a given sale ID.
 * @param c - The Hono context object.
 * @returns A JSON response containing the products on sale.
 */
export async function postProductsOnSale(c: Context) {
	const { saleId } = c.req.param();
	const body = c.get("validatedData");
	const productsOnSale = await insertProductsOnSale(saleId, body);
	return c.json(productsOnSale);

}

/**
 * Updates a product on the sale for a given sale ID and product ID.
 * @param c - The Hono context object.
 * @returns A JSON response containing the products on sale.
 */
export async function putProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const body = c.get("validatedData");
	const productOnSale = await updateProductsOnSale(saleId, productId, body);
	return c.json(productOnSale);
}

/**
 * Deletes a product on the sale for a given sale ID and product ID.
 * @param c - The Hono context object.
 * @returns A JSON response containing the products on sale.
 */
export async function deleteProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const deletedProductOnSale = await deleteProductsOnSale(saleId, productId);
	return c.json(deletedProductOnSale);
}

export async function addOneProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const addedProductOnSale = await addOne(saleId, productId);
	return c.json(addedProductOnSale);
} 