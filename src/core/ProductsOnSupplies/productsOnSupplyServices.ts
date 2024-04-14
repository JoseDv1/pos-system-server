import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import { ProductsOnSupply } from "@prisma/client";
import { checkIfProductExists } from "@/core/Products/productsServices";

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
 * Function to get all products on a supply from the database
 * @param supplyId 
 * @returns an array of products on the supply with the supply and the provider
 */
export async function findProductsOnSupply(supplyId: string) {
	// Get all products on the supply
	const productsOnSupply = await prisma.productsOnSupply.findMany({
		where: {
			supplyId
		},
		include: {
			product: true,
			supply: true
		}
	});

	return productsOnSupply;
}

/**
 * Function to get a product on a supply from the database by ProductId and SupplyId
 * @param supplyId 
 * @param productId 
 * @returns a Specific product on the supply with the supply and the provider
 */
export async function findProductOnSupply(supplyId: string, productId: string) {
	// Get the product on the supply
	const productOnSupply = await prisma.productsOnSupply.findUnique({
		where: {
			productId_supplyId: {
				productId,
				supplyId
			}
		}
	})

	return productOnSupply;
}

/**
 * Function to insert a product on a supply in the database by SupplyId
 * @param supplyId 
 * @param products 
 * @returns 
 */
export async function insertProductsOnSupply(supplyId: string, product: Pick<ProductsOnSupply, "productId" | "quantity">) {
	// Validate if the supply exists
	await checkIfSupplyExists(supplyId)

	// Chek if products exists
	const oldProduct = await checkIfProductExists(product.productId);

	// Check if the product is already on the supply
	const productsOnSupplyExists = await prisma.productsOnSupply.findUnique({
		where: {
			productId_supplyId: {
				productId: product.productId,
				supplyId
			}
		},
		include: {
			product: true
		}
	});

	// If the product is already on the supply add the quantity to the product on the supply
	if (productsOnSupplyExists) {
		await prisma.$transaction([
			// Update the total cost of the supply
			prisma.supply.update({
				where: { id: supplyId },
				data: {
					totalCost: {
						increment: oldProduct.price * product.quantity
					}
				}
			}),

			// Update the quantity of the product
			prisma.product.update({
				where: { id: product.productId },
				data: {
					stock: {
						increment: product.quantity
					}
				}
			}),


			// Update the product on the supply
			prisma.productsOnSupply.update({
				where: {
					productId_supplyId: {
						productId: product.productId,
						supplyId
					}
				},
				data: {
					quantity: {
						increment: product.quantity
					}
				},
				include: {
					product: true,
					supply: true
				}
			}),
		]);
	}

	// Calculate the total cost of the supply (Get the cost of the product table and set it to the product on supply cost field)
	const totalCost = oldProduct.price * product.quantity;

	try {
		const [_, __, createdProducts] = await prisma.$transaction([
			// Update the total cost of the supple¿y
			prisma.supply.update({
				where: { id: supplyId },
				data: {
					totalCost: {
						increment: totalCost
					}
				}
			}),

			// Increase the quantity of the products
			prisma.product.update({
				where: { id: product.productId },
				data: {
					stock: {
						increment: product.quantity
					}
				}
			}),

			//  Insert the products on the supply
			prisma.productsOnSupply.create({
				data: {
					...product,
					supplyId,
					unitCost: oldProduct.price,

				},
				include: {
					product: true,
					supply: true
				}
			}),
		]);

		return createdProducts;

	} catch (error) {
		throw new Error("Product on sale not created");
	}
}

/**
 * Function to update a product on a supply in the database by SupplyId and ProductId
 * also update the total cost of the supply and the quantity of the product in stock
 * @param supplyId 
 * @param productId 
 * @param data 
 * @returns the product on the supply with the supply and the product
 */
export async function updateProductOnSupply(supplyId: string, productId: string, data: Omit<ProductsOnSupply, "productId" | "supplyId">) {
	const oldSupply = await checkIfSupplyExists(supplyId)
	const oldProduct = await checkIfProductExists(productId);

	// Check if the product is on the sale
	const oldProductSupply = await prisma.productsOnSupply.findUnique({
		where: {
			productId_supplyId: {
				productId,
				supplyId
			}
		}
	});

	if (!oldProductSupply) {
		throw new ErrorNotFound("Product on sale not found");
	}

	// Check if almost one field is being updated
	if (!data.unitCost && !data.quantity) {
		throw new ErrorBadRequest("At least one field must be updated");
	}

	// Invetory the quantity of the product
	const quantityDiference = data.quantity - oldProductSupply.quantity;
	// Calculate the new Stock of the product
	const newStock = (oldProduct.stock - quantityDiference) * -1
	// Get the diference between the old and the new cost
	const totalCostDiference = (data.unitCost * data.quantity) - (oldProductSupply.unitCost * oldProductSupply.quantity);
	// Update the product on the sale, the total cost of the sale and the quantity of the product in stock
	try {
		const [_, __, updatedProduct] = await prisma.$transaction([



			// Update the total cost of the sale
			prisma.supply.update({
				where: { id: supplyId },
				data: {
					totalCost: oldSupply.totalCost + totalCostDiference
				}
			}),

			// Update the quantity of the product
			prisma.product.update({
				where: { id: productId },
				data: {
					stock: newStock
				}
			}),

			// Update the product on the sale
			prisma.productsOnSupply.update({
				where: {
					productId_supplyId: {
						productId, supplyId
					}
				},
				data,
				include: {
					product: true,
					supply: true
				}
			}),
		]);

		return updatedProduct;
	} catch (error) {
		throw new Error("Product on sale not updated");
	}
}

/**
 * Function to remove a product on a supply in the database by SupplyId and ProductId
 * also update the total cost of the supply and the quantity of the product in stock
 * @param supplyId 
 * @param productId 
 * @returns 
 */
export async function removeProductOnSupply(
	supplyId: string,
	productId: string
) {
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

	const [_, __, deletedProductOnSupply] = await prisma.$transaction([
		// Update the total cost of the supply
		prisma.supply.update({
			where: { id: supplyId },
			data: {
				totalCost: {
					decrement: productOnSupply.quantity * productOnSupply.unitCost
				}
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
	]);


	return deletedProductOnSupply;
}

