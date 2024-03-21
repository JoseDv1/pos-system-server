import {
	describe,
	expect,
	test,
	beforeAll,
	afterAll,
} from 'bun:test'

import {
	findProducts,
	findProduct,
	insertProduct,
	updateProductById,
	deleteProductById,
} from '@/services/productsServices'
import { prisma } from '@/lib/prisma'

const mockProduct = {
	name: 'Test product',
	categoryId: 'a0572b1d-ddc9-4dd6-9205-19eeff4c474e',
	price: 10.99,
}

const updatedProduct = {
	name: 'Updated product',
	price: 19.99,
	stock: 50,
	categoryId: 'b6d46632-9e9a-424c-a78d-31c70b89740a',
}

beforeAll(async () => {
	await prisma.$connect()
	console.log('Connected to the database 🚀')
})

afterAll(async () => {
	await prisma.$disconnect()
	console.log('Disconnected from the database 🚀')
})

// --- Create a new product tests ---
describe('Create Products', () => {
	test('should be able to create a new product', async () => {
		const response = await insertProduct(mockProduct)
		expect(response).toHaveProperty('id')
		expect(response).toHaveProperty('category')
		expect(response).toHaveProperty('categoryId')
		expect(response.category).toHaveProperty('name')
		expect(response.category).toHaveProperty('description')

		expect(response.name).toBe('Test product')
		expect(response.price).toBe(10.99)

		// Clean up
		await prisma.product.delete({
			where: { id: response.id },
		})
	})

	test('should not be able to create a new product without required fields', async () => {
		const response = insertProduct({
			name: '',
			categoryId: '',
			price: 1,
		})
		expect(response).rejects.toThrow("Name, category and price are required")
		// Clean up if the test fails
		await prisma.product.deleteMany({
			where: { name: '' },
		})
	})
})

// --- Get products tests ---
describe('Get Products', () => {
	test('should be able to get all products', async () => {
		const response = await findProducts()
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('category')
		expect(response[0].category).toHaveProperty('name')
	})

	test('should be able to get a product by its id', async () => {
		const newProduct = await insertProduct(mockProduct)
		const response = await findProduct(newProduct.id)

		expect(response).toHaveProperty('id')
		expect(response).toHaveProperty('category')
		expect(response.name).toBe('Test product')
		// Clean up
		await prisma.product.delete({
			where: { id: newProduct.id },
		})
	})

	test('should not be able to get a product by an invalid id', async () => {
		const response = findProduct('invalid-id')
		expect(response).rejects.toThrow("Product not found")
	})

	test('should not be able to get a product by an empty id', async () => {
		const response = findProduct('')
		expect(response).rejects.toThrow("Invalid input: id is required")
	})
})

// --- Update products tests ---
describe('Update Products', () => {
	test('should be able to update a product by its id', async () => {
		const newProduct = await insertProduct(mockProduct)
		const response = await updateProductById(newProduct.id, updatedProduct)

		expect(response).toHaveProperty('id')
		expect(response.name).toBe('Updated product')
		expect(response.price).toBe(19.99)
		expect(response.stock).toBe(50)
		expect(response.categoryId).toBe('updated-category-id')

		// Clean up
		await prisma.product.delete({
			where: { id: newProduct.id },
		})
	})

	test('should not be able to update a product by an invalid id', async () => {
		const response = updateProductById('invalid-id', updatedProduct)
		expect(response).rejects.toThrow("Product not found")
	})

	test('should not be able to update a product by an empty id', async () => {
		const response = updateProductById('', updatedProduct)
		expect(response).rejects.toThrow("Invalid input: id is required")
	})

	test('should not be able to update a product without at least one field', async () => {
		const newProduct = await insertProduct(mockProduct)
		const response = updateProductById(newProduct.id, {
			name: '',
			price: null as any,
			stock: undefined as any,
			categoryId: '',
		})
		expect(response).rejects.toThrow("At least one field is required")
		// Clean up if the test fails
		await prisma.product.delete({
			where: { id: newProduct.id },
		})
	})
})

// --- Delete products tests ---
describe('Delete Products', () => {
	test('should be able to delete a product by its id', async () => {
		const newProduct = await insertProduct(mockProduct)
		const response = await deleteProductById(newProduct.id)
		expect(response).toHaveProperty('id')
		expect(response).toHaveProperty('category')
		expect(response.name).toBe('Test product')
	})

	test('should not be able to delete a product by an invalid id', async () => {
		const response = deleteProductById('invalid-id')
		expect(response).rejects.toThrow("Product not found")
	})

	test('should not be able to delete a product by an empty id', async () => {
		const response = deleteProductById('')
		expect(response).rejects.toThrow("Invalid input: id is required")
	})
})