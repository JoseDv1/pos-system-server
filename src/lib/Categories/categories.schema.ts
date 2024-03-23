import { z } from "zod"

const categoryBaseSchema = z.object({
	id: z.string(),
	name: z.string().min(3, "Invalid input: name is required").max(30, "Invalid input: name is too long"),
	description: z.string().optional()
})


// Create category schema
export const createCategorySchema = categoryBaseSchema.omit({ id: true })

// Update category schema
export const updateCategorySchema = categoryBaseSchema.omit({ id: true }).partial()

