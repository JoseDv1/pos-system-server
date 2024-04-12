import { z } from "zod";

const productOnSupplySchema = z.object({
	productId: z.string().uuid(),
	supplyId: z.string().uuid(),
	quantity: z.number().nonnegative(),
	unitCost: z.number().nonnegative(),
})

export const createProductOnSupplySchema = productOnSupplySchema.omit({
	unitCost: true
})

export const updateProductOnSupplySchema = productOnSupplySchema.partial()