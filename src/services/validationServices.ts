import { ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";



/**
 * Function to check if a supply exists in the database by its id
 * @param supplyId 
 * @returns the supply if it exists
 */
export async function checkIfSupplyExists(supplyId: string) {
	// Validate if the supply exists
	const supply = await prisma.supply.findUnique({
		where: { id: supplyId }
	});

	if (!supply) {
		throw new ErrorNotFound("Supply not found 404");
	}

	return supply;
}

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
 * Function to check if a sale exists in the database by its id
 * @param saleId 
 * @returns the sale if it exists
 */
export async function checkIfSaleExist(saleId: string) {
	// Validate if the sale exists
	const sale = await prisma.sale.findUnique({
		where: { id: saleId }
	});

	if (!sale) {
		throw new ErrorNotFound("Sale not found 404");
	}

	return sale;
}

export async function checkIfClientExist(clientId: string) {
	// Validate if the client exists
	const client = await prisma.client.findUnique({
		where: { id: clientId }
	});

	if (!client) {
		throw new ErrorNotFound("Client not found 404");
	}

	return client;
}