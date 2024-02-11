import { Context } from "hono";
import { ProductsOnSales } from "@prisma/client";
import { deleteProductsOnSale, findProductsOnSale, findProductsOnSaleByProductId, insertProductsOnSale, updateProductsOnSale } from "@/services/productsOnSaleServices"

export async function getProductsOnSale(c: Context) {
	const { saleId } = c.req.param();
	const productsOnSale = await findProductsOnSale(saleId);
	return c.json(productsOnSale);
}

export async function getProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const productOnSale = await findProductsOnSaleByProductId(saleId, productId);
	return c.json(productOnSale);
}

export async function postProductsOnSale(c: Context) {
	const { saleId } = c.req.param();
	const products = await c.req.json<ProductsOnSales[]>();
	const productsOnSale = await insertProductsOnSale(saleId, products);
	return c.json(productsOnSale);

}

export async function putProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const product = await c.req.json<ProductsOnSales>();
	const productOnSale = await updateProductsOnSale(saleId, productId, product);
	return c.json(productOnSale);
}

export async function deleteProductOnSale(c: Context) {
	const { saleId, productId } = c.req.param();
	const deletedProductOnSale = await deleteProductsOnSale(saleId, productId);
	return c.json(deletedProductOnSale);
}
