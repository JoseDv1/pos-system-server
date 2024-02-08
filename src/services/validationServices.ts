import { ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";

// ------------------- Validations -------------------

// Supply
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

// Product
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

// Sales 
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