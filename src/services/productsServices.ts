import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";




export async function findProducts({ category }: {
	category: string;
}) {

	const products: Array<Product> = await prisma.product.findMany({
		include: {
			category: Boolean(category)
		}
	});

	if (!products) {
		return null;
	}

	return products;
}

export async function findUncategorizedProducts(): Promise<Product[]> {
	const products: Array<Product> = await prisma.product.findMany({
		where: {
			categoryId: null
		}
	});

	return products;
}