import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import type { ProductsOnSales } from "@prisma/client";
import { checkIfProductExists } from "@/core/Products/productsServices";
import { checkIfSaleExist } from "@/core/Sales/salesService";



/** 
 * Function to get all products on a sale from the database
 * @param saleId 
 * @returns an array of products on the sale with the sale and the client
 */
export async function findProductsOnSale(saleId: string) {
	// Get all products on the sale from the database
	const productsOnSale = await prisma.sale.findUnique({
		where: { id: saleId },
		include: {
			saleProducts: {
				include: {
					product: true,
				}
			},
			client: true
		}
	})

	if (!productsOnSale) {
		throw new ErrorNotFound("Products on sale not found");
	}

	return productsOnSale;
}

/**
 * Function to get a product on a sale from the database by ProductId and SaleId
 * @param saleId 
 * @param productId 
 * @returns a Specific product on the sale with the sale and the client
 */
export async function findProductsOnSaleByProductId(saleId: string, productId: string) {
	// Validate if the sale exists
	await checkIfSaleExist(saleId);

	// Validate if the product exists
	await checkIfProductExists(productId);

	// Get the product on the sale from the database
	const productOnSale = await prisma.sale.findFirst(
		{
			where: {
				id: saleId
			},
			include: {
				saleProducts: {
					where: {
						productId
					},
					include: {
						product: true
					}
				}
			}
		}
	)

	if (!productOnSale) {
		throw new ErrorNotFound("Product on sale not found");
	}

	return productOnSale;
}

/**
 * Function to insert products on a sale to the database also update the total cost of the sale and the quantity of the product in stock 
 * @param saleId 
 * @param product 
 * @returns the product on the sale with the sale and the product
 */
export async function insertProductsOnSale(saleId: string, product: ProductsOnSales) {
	// Validate if the sale exists
	await checkIfSaleExist(saleId);

	// Chek if all products exists
	const oldProduct = await checkIfProductExists(product.productId);
	// Check if the product is already on the sale
	const productsOnSaleExists = await prisma.productsOnSales.findUnique({
		where: {
			productId_saleId: {
				productId: product.productId,
				saleId
			}
		},
		include: {
			product: true
		}
	});

	// If the product is already on the sale add the quantity to the product on the sale
	if (productsOnSaleExists) {
		await prisma.$transaction([
			// Update the total cost of the sale
			prisma.sale.update({
				where: { id: saleId },
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
						decrement: product.quantity
					}
				}
			}),
			// Update the product on the sale
			prisma.productsOnSales.update({
				where: {
					productId_saleId: {
						productId: product.productId,
						saleId
					}
				},
				data: {
					quantity: {
						increment: product.quantity
					}
				},
				include: {
					product: true,
					sale: true
				}
			}),
		]);
	}

	// Calculate the total cost of the sale (Get the cost of the product table and set it to the product on sale cost field)
	const totalCost = oldProduct.price * product.quantity;
	try {
		const [_, __, createdProducts] = await prisma.$transaction([
			// Update the total cost of the sale
			prisma.sale.update({
				where: { id: saleId },
				data: {
					totalCost: {
						increment: totalCost
					}
				}
			}),

			// Decrease the quantity of the products
			prisma.product.update({
				where: { id: product.productId },
				data: {
					stock: {
						decrement: product.quantity
					}
				}
			}),

			//  Insert the products on the sale
			prisma.productsOnSales.create({
				data: {
					...product,
					saleId,
					unitCost: oldProduct.price,

				},
				include: {
					product: true,
					sale: true
				}
			}),
		]);

		return createdProducts;

	} catch (error) {
		throw new Error("Product on sale not created");
	}

}

/**
 * Function to update products on a sale in the database also update the total cost of the sale and the quantity of the product in stock
 * @param saleId 
 * @param productId 
 * @param data A product on sale object with the data to update
 * @returns the product on the sale with the sale and the product
 */
export async function updateProductsOnSale(saleId: string, productId: string, data: Omit<ProductsOnSales, "productId" | "saleId">) {
	const oldSale = await checkIfSaleExist(saleId);
	const oldProduct = await checkIfProductExists(productId);

	// Check if the product is on the sale
	const oldProductOnSale = await prisma.productsOnSales.findUnique({
		where: {
			productId_saleId: {
				productId, saleId
			}
		}
	});

	if (!oldProductOnSale) {
		throw new ErrorNotFound("Product on sale not found");
	}

	// Check if almost one field is being updated
	if (!data.unitCost && !data.quantity) {
		throw new ErrorBadRequest("At least one field must be updated");
	}

	// Invetory the quantity of the product
	const quantityDiference = data.quantity - oldProductOnSale.quantity;
	// Calculate the new Stock of the product
	const newStock = oldProduct.stock - quantityDiference
	// Get the diference between the old and the new cost
	const totalCostDiference = (data.unitCost * data.quantity) - (oldProductOnSale.unitCost * oldProductOnSale.quantity);
	// Update the product on the sale, the total cost of the sale and the quantity of the product in stock
	try {
		const [_, __, updatedProduct] = await prisma.$transaction([



			// Update the total cost of the sale
			prisma.sale.update({
				where: { id: saleId },
				data: {
					totalCost: oldSale.totalCost + totalCostDiference
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
			prisma.productsOnSales.update({
				where: {
					productId_saleId: {
						productId, saleId
					}
				},
				data,
				include: {
					product: true,
					sale: true
				}
			}),
		]);

		return updatedProduct;
	} catch (error) {
		throw new Error("Product on sale not updated");
	}
}

/**
 * Function to delete a product on a sale from the database also update the total cost of the sale and the quantity of the product in stock
 * @param saleId 
 * @param productId 
 * @returns the product on the sale with the sale and the product
 */
export async function deleteProductsOnSale(saleId: string, productId: string) {
	await checkIfSaleExist(saleId);
	await checkIfProductExists(productId);

	const oldProductOnSale = await prisma.productsOnSales.findUnique({
		where: {
			productId_saleId: {
				productId, saleId
			}
		}
	});

	if (!oldProductOnSale) {
		throw new ErrorNotFound("Product on sale not found");
	}

	// Transaction to delete the product on the sale and update the total cost of the sale
	const [_, __, deletedProduct] = await prisma.$transaction([
		// Update the total cost of the sale
		prisma.sale.update({
			where: { id: saleId },
			data: {
				totalCost: {
					decrement: oldProductOnSale.unitCost * oldProductOnSale.quantity
				}
			}
		}),

		// Increase the quantity of the product
		prisma.product.update({
			where: { id: productId },
			data: {
				stock: {
					increment: oldProductOnSale.quantity
				}
			}
		}),

		// Delete the product on the sale
		prisma.productsOnSales.delete({
			where: {
				productId_saleId: {
					productId, saleId
				}
			}
		}),
	])



	if (!deletedProduct) {
		throw new ErrorBadRequest("Product on sale not deleted");
	}

	return deletedProduct;
}

export async function addOne(saleId: string, productId: string) {
	const productOnSale = await prisma.productsOnSales.findUnique({
		where: {
			productId_saleId: {
				productId, saleId
			}
		}
	});

	if (!productOnSale) {
		throw new ErrorNotFound("Product on sale not found");
	}

	const [_, __, updatedProduct] = await prisma.$transaction([
		prisma.sale.update({
			where: { id: saleId },
			data: {
				totalCost: {
					increment: productOnSale.unitCost
				}
			}
		}),
		prisma.product.update({
			where: { id: productId },
			data: {
				stock: {
					decrement: 1
				}
			}
		}),
		prisma.productsOnSales.update({
			where: {
				productId_saleId: {
					productId, saleId
				}
			},
			data: {
				quantity: {
					increment: 1
				}
			}
		})
	]);

	return updatedProduct;
}

