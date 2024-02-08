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
			productsSales: {
				include: {
					product: true
				}
			}
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
				productsSales: {
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
export async function insertProductsOnSale(saleId: string, products: ProductsOnSales[]) {
	// Validate if the sale exists
	await checkIfSaleExist(saleId);

	// Chek if all products exists
	products.forEach(async (product) => {
		const oldProduct = await checkIfProductExists(product.productId);

		// Check the cost and quantity of the products
		if (product.unitCost <= 0 || product.quantity <= 0) {
			throw new ErrorBadRequest("Invalid value or quantity")
		}

		// Check if the quantity of the products is enough
		if (product.quantity > oldProduct.stock) {
			throw new ErrorBadRequest(`The quantity of the product ${oldProduct.name} is not enough `);
		}
	});


	// Calculate the total cost of the sale
	const totalCost = products.reduce((acc, product) => {
		return acc + (product.unitCost * product.quantity);
	}, 0);


	const [updatedProducts] = await prisma.$transaction([
		//  Insert the products on the sale
		prisma.productsOnSales.createMany({
			data: products.map((product) => {
				return {
					saleId,
					productId: product.productId,
					unitCost: product.unitCost,
					quantity: product.quantity
				}
			})
		}),

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
		...products.map((product) => {
			return prisma.product.update({
				where: { id: product.productId },
				data: {
					stock: {
						decrement: product.quantity
					}
				}
			})
		})
	]);

	if (!updatedProducts) {
		throw new ErrorBadRequest("Products on sale not created");
	}

	return updatedProducts;

}

// Update products on the sale
export async function updateProductsOnSale(saleId: string, productId: string, data: ProductsOnSales) {
	// Validate if the sale exists
	const oldSale = await checkIfSaleExist(saleId);

	// Validate if the product exists
	const oldProduct = await checkIfProductExists(productId);

	// Check the cost and quantity of the product
	if (data.unitCost <= 0 || data.quantity <= 0) {
		throw new ErrorBadRequest("Invalid value or quantity");
	}

	// Check if almost one field is being updated
	if (!data.unitCost && !data.quantity) {
		throw new ErrorBadRequest("At least one field must be updated");
	}

	// Get the diference between the old and the new quantity
	const diferenceQuantity = data.quantity - oldProduct.stock;


	// Check if the quantity of the product is enough
	if (diferenceQuantity > oldProduct.stock) {
		throw new ErrorBadRequest("The quantity of the product is not enough");
	}

	// Get the diference between the old and the new cost
	const diferenceCost = (data.unitCost * data.quantity) - oldSale.totalCost;


	// Update the product on the sale, the total cost of the sale and the quantity of the product in stock
	const [updatedProduct] = await prisma.$transaction([

		// Update the product on the sale
		prisma.productsOnSales.update({
			where: {
				productId_saleId: {
					productId, saleId
				}
			},
			data,
		}),

		// Update the total cost of the sale
		prisma.sale.update({
			where: { id: saleId },
			data: {
				totalCost: oldSale.totalCost + diferenceCost
			}
		}),

		// Update the quantity of the product
		prisma.product.update({
			where: { id: productId },
			data: {
				stock: oldProduct.stock - diferenceQuantity
			}
		})
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

	// Delete the product on the sale
	const deletedProduct = await prisma.productsOnSales.delete({
		where: {
			productId_saleId: {
				productId, saleId
			}
		}
	});

	if (!deletedProduct) {
		throw new ErrorBadRequest("Product on sale not deleted");
	}

	return deletedProduct;
}


