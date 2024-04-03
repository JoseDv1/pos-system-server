import { z } from "zod";

const ProviderSchema = z.object({
	name: z.string().min(3, "El nombre del proveedor debe tener al menos 3 caracteres"),
	phone: z.string().min(6, "El número de teléfono debe tener al menos 6 dígitos"),
	supplyDays: z.string(),
});

export const createProviderSchema = ProviderSchema
export const updateProviderSchema = ProviderSchema.partial()