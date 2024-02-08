import { Context } from "hono";
import { ProductsOnSupply } from "@prisma/client";
import { findProductOnSupply, findProductsOnSupply, insertProductsOnSupply, removeProductOnSupply, updateProductOnSupply } from "@/services/productsOnSupplyServices";


// Get Controllers
export async function getProductsOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();

	// Get all products on the supply
	const productsOnSupply = await findProductsOnSupply(supplyId);
	return ctx.json(productsOnSupply);

}

export async function getProductsOnSupplyById(ctx: Context) {

	const { supplyId, productId } = ctx.req.param();

	// Get the product on the supply
	const productOnSupply = await findProductOnSupply(supplyId, productId);
	return ctx.json(productOnSupply);
}


// Insert Controllers
export async function postProductsOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();
	const body: ProductsOnSupply[] = await ctx.req.json();

	// Insert all products on the supply
	const productOnSupply = await insertProductsOnSupply(supplyId, body);


	// Return the product that was inserted on the supply
	return ctx.json(productOnSupply);

}

// Update Controllers
export async function putProductOnSupply(ctx: Context) {

	const { supplyId, productId } = ctx.req.param();
	const body: ProductsOnSupply = await ctx.req.json();

	const updatedProductOnSupply = await updateProductOnSupply(supplyId, productId, body);


	return ctx.json(updatedProductOnSupply);
}

// Delete Controllers
export async function deleteProductOnSupply(ctx: Context) {
	const { supplyId, productId } = ctx.req.param();

	// Delete the product on the supply
	const deletedProductOnSupply = await removeProductOnSupply(supplyId, productId);

	return ctx.json(deletedProductOnSupply);
}




