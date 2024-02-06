import { ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { ProductsOnSupply } from "@prisma/client";

export async function findProductsOnSupply(supplyId: string) {
	// Validate if the supply exists
	const supply = await prisma.supply.findUnique({
		where: { id: supplyId }
	});

	if (!supply) {
		throw new ErrorNotFound("Supply not found");
	}

	// Get all products on the supply
	const productsOnSupply: Array<ProductsOnSupply> = await prisma.productsOnSupply.findMany({
		where: {
			supplyId: supplyId
		}
	});

	if (!productsOnSupply) {
		throw new ErrorNotFound("Products on supply not found");
	}

	return productsOnSupply;
}

