import { z } from "zod"

const productSchema = z.object({
	name: z.string().min(3, "El nombre debe tener al menos 1 caracter"),
	price: z.number().min(0).nonnegative("El numero debe ser positivo"),
	stock: z.number().int("El numero debe ser entero").min(0, "El numero debe ser mayor que 0").nonnegative("El numero debe ser positivo"),
	categoryId: z.string(),
	isRawMaterial: z.boolean(),
})

export const createProductSchema = productSchema.omit({ stock: true })

export const updateProductSchema = productSchema.partial()

