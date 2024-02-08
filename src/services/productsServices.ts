import { ErrorBadRequest, ErrorNotFound } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";




async function checkIfProductExists(productId: string) {
	// Validate if the product exists
	const product = await prisma.product.findUnique({
		where: { id: productId }
	});

	if (!product) {
		throw new ErrorNotFound("Product not found 404");
	}

	return product;
}

export async function findProducts({ category }: {
	category: string;
}) {

	const products: Array<Product> = await prisma.product.findMany({
		include: {
			category: Boolean(category)
		}
	});

	if (!products) {
		throw new ErrorNotFound("Products not found");
	}

	return products;
}

export async function findUncategorizedProducts() {
	const products: Array<Product> = await prisma.product.findMany({
		where: {
			categoryId: null
		}
	});

	if (!products) {
		throw new ErrorNotFound("Uncategorized products not found");
	}

	return products;
}

export async function findProduct(productId: string) {
	const product = await checkIfProductExists(productId);
	return product;
}

export async function insertProduct(data: Product) {
	const { name, categoryId, price, stock } = data;

	// Validate the fields
	if (!name || !categoryId || !price) {
		throw new ErrorBadRequest("Name, category and price are required");
	}

	// Check if the product already exists
	const existingProduct = await prisma.product.findFirst({
		where: { name, categoryId, price, stock },
	});

	// If the product already exists, return an error
	if (existingProduct) {
		throw new ErrorBadRequest("Product already exists");
	}

	// Chech if the category exists
	const category = await prisma.category.findUnique({
		where: { id: categoryId }
	});

	// If the category does not exists, return an error
	if (!category) {
		throw new ErrorNotFound("Category not found");
	}

	// Create a new product in database
	const product = await prisma.product.create({
		data: {
			name, categoryId, price, stock
		},
		include: {
			category: {
				select: {
					name: true,
					description: true
				}
			}
		}
	});

	return product;
}

export async function updateProductById(productId: string, data: Product) {
	const { name, price, stock, categoryId } = data;




	// Check is almost one field is provided
	if (!name && !price && !categoryId && stock == undefined) {
		throw new ErrorBadRequest("At least one field is required");
	}

	// Check if the product already exists
	const findProduct = await prisma.product.findUnique({
		where: {
			id: productId
		},
	});

	// If the product does not exists, return an error
	if (!findProduct) {
		throw new ErrorNotFound("Product not found");
	}

	// if the object is the same, return the object
	if (findProduct.name === name &&
		findProduct.price === price &&
		findProduct.stock === stock &&
		findProduct.categoryId === categoryId
	) {
		return findProduct;
	}

	// Update the product in database
	const updatedProduct = await prisma.product.update({
		where: { id: productId },
		data: {
			name,
			categoryId,
			price,
			stock,
		},
		include: {
			category: true
		}
	});


	return updatedProduct;
}

export async function deleteProductById(productId: string) {
	// Check if the product exists
	const product = await checkIfProductExists(productId);

	// Delete the product in database
	const deletedProduct = await prisma.product.delete({
		where: { id: productId }
	});

	return deletedProduct;
}