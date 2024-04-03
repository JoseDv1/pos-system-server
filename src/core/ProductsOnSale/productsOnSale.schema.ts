import { z } from "zod";

const productsOnSaleSchema = z.object({
	productId: z.string().uuid({ message: "Invalid Product ID" }),
	saleId: z.string().uuid({ message: "Invalid Sale ID" }),
	quantity: z.number().gte(0, { message: "La cantidad debe ser mayor o igual que 0" }),
	unitCost: z.number().gte(0, { message: "El costo unitario debe ser mayor o igual que  0" }),
})

export const createProductsOnSaleSchema = productsOnSaleSchema.omit({ unitCost: true, saleId: true });
export const updateProductsOnSaleSchema = productsOnSaleSchema.omit({ productId: true, saleId: true });