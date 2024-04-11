import { z } from "zod"

const salesSchema = z.object({
	clientId: z.string().uuid(),
	totalCost: z.number().nonnegative(),
	status: z.enum(["PENDING", "PAYED"]),
	paymentMethod: z.enum(["CASH", "CARD", "TRANSFER"]),
	note: z.string().optional(),
})

export const createSalesSchema = salesSchema.pick({ clientId: true })
export const updateSalesSchema = salesSchema.partial()