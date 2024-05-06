import { z } from 'zod';

export const clientSchema = z.object({
	id: z.string(),
	name: z.string().min(3, "El nombre debe tener almenos 3 caracteres").max(30, "El nombre no debe tener más de 30 caracteres"),
	email: z.string().email().optional(),
	address: z.string().optional(),
	active: z.boolean().default(true),
});

export const createClientSchema = clientSchema.omit({ id: true });
export const updateClientSchema = clientSchema.omit({ id: true }).partial();

