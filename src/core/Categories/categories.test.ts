import {
	describe,
	expect,
	test,
	beforeAll,
	afterAll,
} from 'bun:test'

import { insertCategory, findCategories, findCategoryById, updateCategory, deleteCategoryById } from './categoriesServices'
import { prisma } from '@/utils/prisma'

const mockCategory = {
	name: 'Test category',
	description: 'Test category description',
}
const updatedCategory = {
	name: 'Updated category',
	description: 'Updated category description',
}

beforeAll(async () => {
	await prisma.$connect()
	console.log('Connected to the database 🚀')
})

afterAll(async () => {
	await prisma.$disconnect()
	console.log('Disconnected from the database 🚀')
})


// --- Create a new category tests ---
describe('Create Categories', () => {
	test('should be able to create a new category', async () => {
		const response = await insertCategory(mockCategory)
		expect(response).toHaveProperty('id')
		expect(response.name).toBe('Test category')
		expect(response.description).toBe('Test category description')
		// Clean up
		await prisma.category.delete({
			where: { id: response.id },
		})
	})

	test('should not be able to create a new category without a name', async () => {
		const response = insertCategory({
			name: '',
			description: 'Test category description',
		})
		expect(response).rejects.toThrow()
		// Clean up if the test fails
		await prisma.category.deleteMany({
			where: { name: '' },
		})
	})
})

// --- Get categories tests ---
describe('Get Categories', () => {
	test('should be able to get all categories', async () => {
		const response = await findCategories()
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('products')
	})

	test('should be able to get a category by its id', async () => {
		const newCategory = await insertCategory(mockCategory)
		const response = await findCategoryById(newCategory.id)
		expect(response).toHaveProperty('id')
		expect(response).toHaveProperty('products')
		expect(response.products).toBeInstanceOf(Array)
		expect(response.name).toBe('Test category')
		expect(response.description).toBe('Test category description')
		// Clean up
		await prisma.category.delete({
			where: { id: newCategory.id },
		})
	})

	test('should not be able to get a category by an invalid id', async () => {
		const response = findCategoryById('invalid-id')
		expect(response).rejects.toThrow("Category not found")
	})

	test('should not be able to get a category by an empty id', async () => {
		const response = findCategoryById('')
		expect(response).rejects.toThrow("Invalid input: id is required")
	})
})

// --- Update categories tests ---
describe('Update Categories', () => {
	test('should be able to update a category by its id', async () => {
		const newCategory = await insertCategory(mockCategory)
		const response = await updateCategory(newCategory.id, updatedCategory)

		expect(response).toHaveProperty('id')
		expect(response.name).toBe('Updated category')
		expect(response.description).toBe('Updated category description')

		// Clean up
		await prisma.category.delete({
			where: { id: newCategory.id },
		})
	})

	test('should not be able to update a category by an invalid id', async () => {
		const response = updateCategory('invalid-id', updatedCategory)
		expect(response).rejects.toThrow("Category not found")
	})

	test('should not be able to update a category by an empty id', async () => {
		const response = updateCategory('', updatedCategory)
		expect(response).rejects.toThrow("Invalid input: id is required")
	})

	test('should not be able to update a category without a name', async () => {
		const newCategory = await insertCategory(mockCategory)
		const response = updateCategory(newCategory.id, {
			name: '',
			description: 'Updated category description',
		})
		expect(response).rejects.toThrow()
		// Clean up if the test fails
		await prisma.category.delete({
			where: { id: newCategory.id },
		})
	})

	test('should not be able to update a category with the same name as another category', async () => {
		const newCategory = await insertCategory(mockCategory)
		const anotherCategory = await insertCategory({
			name: 'Another category',
			description: 'Another category description',
		})
		const response = updateCategory(newCategory.id, {
			name: 'Another category',
			description: 'Updated category description',
		})
		expect(response).rejects.toThrow("Category already exists")
		// Clean up if the test fails
		await prisma.category.delete({
			where: { id: newCategory.id },
		})
		await prisma.category.delete({
			where: { id: anotherCategory.id },
		})

	})

	test('should not be able to update a category without at least one field', async () => {
		const newCategory = await insertCategory(mockCategory)
		const response = updateCategory(newCategory.id, {
			name: '',
			description: '',
		})
		expect(response).rejects.toThrow("Invalid input: at least one field is required")
		// Clean up if the test fails
		await prisma.category.delete({
			where: { id: newCategory.id },
		})
	})

	test('should not be able to update a category without a name', async () => {
		const newCategory = await insertCategory(mockCategory)
		const response = updateCategory(newCategory.id, {
			name: '',
			description: 'Updated category description',
		})
		expect(response).rejects.toThrow("Invalid input: name is required")
		// Clean up if the test fails
		await prisma.category.delete({
			where: { id: newCategory.id },
		})
	})
})

// --- Delete categories tests ---
describe('Delete Categories', () => {
	test('should be able to delete a category by its id', async () => {
		const newCategory = await insertCategory(mockCategory)
		const response = await deleteCategoryById(newCategory.id)
		expect(response).toHaveProperty('id')
		expect(response.name).toBe('Test category')
		expect(response.description).toBe('Test category description')
	})

	test('should not be able to delete a category by an invalid id', async () => {
		const response = deleteCategoryById('invalid-id')
		expect(response).rejects.toThrow("Category not found")
	})

	test('should not be able to delete a category by an empty id', async () => {
		const response = deleteCategoryById('')
		expect(response).rejects.toThrow("Invalid input: id is required")
	})

})
