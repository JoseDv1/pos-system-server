import { ErrorBadRequest, ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { ProductsOnSupply } from "@prisma/client";
import { checkIfSupplyExists, checkIfProductExists } from "./validationServices";
import { findProduct } from "@/services/productsServices"




// ------------------- Services -------------------
export async function findProductsOnSupply(supplyId: string) {
	// Validate if the supply exists
	const supply = await checkIfSupplyExists(supplyId);

	// Get all products on the supply
	const productsOnSupply = await prisma.supply.findUnique({
		where: { id: supplyId },
		include: {
			productsOnSupply: {
				include: {
					product: true
				}
			}
		}
	});

	if (!productsOnSupply) {
		throw new ErrorNotFound("Products on supply not found");
	}

	return productsOnSupply;
}

export async function findProductOnSupply(supplyId: string, productId: string) {

	// Validate if the supply exists
	const supply = await checkIfSupplyExists(supplyId);

	// Validate if the product exists
	const product = await checkIfProductExists(productId);

	// Get the product on the supply
	const productOnSupply = await prisma.productsOnSupply.findFirst({
		where: {
			productId,
			supplyId
		},
		include: {
			product: true
		}
	});

	if (!productOnSupply) {
		throw new ErrorNotFound("Product on supply not found");
	}

	return productOnSupply;
}

export async function insertProductsOnSupply(supplyId: string, products: ProductsOnSupply[]) {
	// Check if the supply exists
	const supply = await checkIfSupplyExists(supplyId);

	// Check if all products exists
	products.forEach(async (product) => {
		await checkIfProductExists(product.productId);
	});

	// Check if the cost of the products is negative
	const negativeCost = products.find((product) => product.unitCost < 0);
	if (negativeCost) {
		throw new ErrorBadRequest("Unit cost cannot be negative");
	}

	// Check if the quantity of the products is negative
	const negativeQuantity = products.find((product) => product.quantity <= 0);
	if (negativeQuantity) {
		throw new ErrorBadRequest("Quantity cannot be negative");
	}

	// Check if the products is already on the supply
	const productsOnSupplyExists = await prisma.productsOnSupply.findMany({
		where: {
			productId: {
				in: products.map((product) => product.productId)
			},
			supplyId
		}, include: {
			product: true
		}
	});


	productsOnSupplyExists.forEach((productOnSupply) => {
		const product = products.find((product) => product.productId === productOnSupply.productId);
		if (product) {
			throw new ErrorBadRequest(`Product ${productOnSupply.product.name} is already on the supply`);
		}
	});



	// Calculate the total cost of the products to insert on the supply
	const totalCost = products.reduce((acc, product) => {
		const totalProductCost = product.quantity * product.unitCost;
		return acc + totalProductCost;
	}, 0);
	if (totalCost < 0) {
		throw new ErrorBadRequest("Total cost cannot be negative");
	}





	const transaction = await prisma.$transaction([

		// Update the total cost of the supply
		prisma.supply.update({
			where: { id: supplyId },
			data: {
				totalCost: {
					increment: totalCost
				}
			}
		}),

		// Update the stock of the products
		...products.map((product) => {
			return prisma.product.update({
				where: { id: product.productId },
				data: {
					stock: {
						increment: product.quantity
					}
				}
			})
		}),

		// Insert the products on the supply
		prisma.productsOnSupply.createMany({
			data: products.map((product) => {
				return {
					...product,
					supplyId
				}
			}),
		}),
	]);


	// Return the inserted products on supply
	return transaction[transaction.length - 1];
}

export async function updateProductOnSupply(supplyId: string, productId: string, data: ProductsOnSupply) {

	// Check if almost one field is being updated
	if (!data.quantity && !data.unitCost) {
		throw new ErrorBadRequest("At least one field must be updated");
	}

	// Check if the supply exists
	const supply = await checkIfSupplyExists(supplyId);

	// Check if the product exists
	const product = await checkIfProductExists(productId);

	// Calculate the total cost of the product to update on the supply
	const totalCost = data.quantity * data.unitCost;
	if (totalCost < 0) {
		throw new ErrorBadRequest("Total cost cannot be negative");
	}

	// Get the diference beetwen the old and the new const
	const costDiference = totalCost - supply.totalCost;
	const newTotalCost = supply.totalCost + costDiference;

	// Get the diference beetwen the old and the new stock on product
	const stockDiference = data.quantity - product.stock;
	if (stockDiference < 0) {
		throw new ErrorBadRequest("Stock cannot be negative");
	}


	const [updatedSupplyTotalCost, updatedProductTotalStock, updatedProductOnSupply] = await prisma.$transaction(// Update the product on the supply
		[

			// Update the total cost of the supply
			prisma.supply.update({
				where: { id: supplyId },
				data: {
					totalCost: newTotalCost
				}
			}),

			// Update the stock of the product
			prisma.product.update({
				where: { id: productId },
				data: {
					stock: {
						increment: stockDiference
					}
				}
			}),
			prisma.productsOnSupply.update({
				where: {
					productId_supplyId: {
						productId,
						supplyId
					}
				}, data,
				include: {
					product: true,
					supply: true
				}
			})
		]);


	return updatedProductOnSupply;
}

export async function removeProductOnSupply(
	supplyId: string,
	productId: string
) {
	// Check if the supply exists
	const supply = await checkIfSupplyExists(supplyId);

	// Check if the product exists
	const product = await checkIfProductExists(productId);

	// Check if the product is already on the supply
	const productOnSupply = await prisma.productsOnSupply.findFirst({
		where: {
			productId,
			supplyId
		}
	});

	if (!productOnSupply) {
		throw new ErrorNotFound("Product on supply not found");
	}

	const [deletedProductOnSupply] = await prisma.$transaction([
		// Delete the product on the supply
		prisma.productsOnSupply.delete({
			where: {
				productId_supplyId: {
					productId,
					supplyId
				},
			},
			include: {
				product: true,
				supply: true
			}
		}),

		// Update the stock of the product
		prisma.product.update({
			where: { id: productId },
			data: {
				stock: {
					decrement: productOnSupply.quantity
				}
			}
		}),

		// Update the total cost of the supply
		prisma.supply.update({
			where: { id: supplyId },
			data: {
				totalCost: {
					decrement: productOnSupply.quantity * productOnSupply.unitCost
				}
			}
		})
	]);


	return deletedProductOnSupply;

}

