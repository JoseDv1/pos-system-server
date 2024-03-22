import { z } from "zod"

// Create category schema
export const createCategorySchema = z.object({
	name: z.string().min(1, "Invalid input: name is required"),
	description: z.string().optional(),
})

// Update category schema
export const updateCategorySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
})

