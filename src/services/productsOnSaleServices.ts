import { ErrorBadRequest, ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { checkIfProductExists, checkIfSaleExist } from "./validationServices";
import type { ProductsOnSales } from "@prisma/client";



// ------------------- Services -------------------

// Get all products on the sale
export async function findProductsOnSale(saleId: string) {
	// Validate if the sale exists
	await checkIfSaleExist(saleId);

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

// Get a product on the sale
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

// Insert products on the sale
export async function insertProductsOnSale(saleId: string, product: ProductsOnSales) {

	if (product.unitCost) {
		product.unitCost = Number(product.unitCost);
	}

	if (product.quantity) {
		product.quantity = Number(product.quantity);
	}

	// Validate if the sale exists
	await checkIfSaleExist(saleId);

	// Chek if all products exists
	const oldProduct = await checkIfProductExists(product.productId);

	// Check the cost and quantity of the products
	if (product.unitCost && product.unitCost <= 0 || product.quantity && product.quantity <= 0) {
		throw new ErrorBadRequest("Invalid value or quantity")
	}



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

	if (productsOnSaleExists) {
		throw new ErrorBadRequest(`Product ${productsOnSaleExists.product.name} is already on the sale`);
	}

	// Calculate the total cost of the sale
	const totalCost = oldProduct.price * product.quantity;



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

	if (!createdProducts) {
		throw new ErrorBadRequest("Products on sale not created");
	}

	return createdProducts;

}

// Update products on the sale
export async function updateProductsOnSale(saleId: string, productId: string, data: ProductsOnSales) {
	// Validate if the sale exists
	const oldSale = await checkIfSaleExist(saleId);
	// Validate if the product exists
	const oldProduct = await checkIfProductExists(productId);

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

	// Cast the unitCost and quantity to number
	if (data.unitCost) {
		data.unitCost = Number(data.unitCost);
	}

	if (data.quantity) {
		data.quantity = Number(data.quantity);
	}

	// Check the cost and quantity of the product
	if (data.unitCost && data.unitCost <= 0 || data.quantity && data.quantity <= 0) {
		throw new ErrorBadRequest("Invalid value or quantity");
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

	if (!updatedProduct) {
		throw new ErrorBadRequest("Product on sale not updated");
	}

	return updatedProduct;
}

// Delete products on the sale
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


