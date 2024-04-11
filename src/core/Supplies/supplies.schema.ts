import { z } from 'zod';

const suppliesSchema = z.object({
	totalCost: z.number().nonnegative("El costo total debe ser mayor a 0"),
	providerId: z.string().uuid(),
})

export const createSuppliesSchema = suppliesSchema.omit({ totalCost: true });
export const updateSuppliesSchema = suppliesSchema.partial()