import { Context } from "hono";
import { ProductsOnSales } from "@prisma/client";
import { deleteProductsOnSale, findProductsOnSale, findProductsOnSaleByProductId, insertProductsOnSale, updateProductsOnSale } from "@/services/productsOnSaleServices"


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
	const product = await c.req.json<ProductsOnSales>();

	const productsOnSale = await insertProductsOnSale(saleId, product);
	return c.json(productsOnSale);

}

/**
 * Updates a product on the sale for a given sale ID and product ID.
 * @param c - The Hono context object.
 * @returns A JSON response containing the products on sale.
 */
export async function putProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const product = await c.req.json<ProductsOnSales>();
	const productOnSale = await updateProductsOnSale(saleId, productId, product);
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
