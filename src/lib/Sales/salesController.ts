import { Context } from "hono";
import { prisma } from "@/utils/prisma";
import { $Enums, type Sale } from "@prisma/client";
import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { createSaleService, deleteSaleService, findSaleByIdService, findSalesService, markAllSalesAsPaidByClientService, markSaleAsPaidService, markSaleAsPendingService, updateSaleService } from "./salesService";

/**
 * Get Sales Controller function that returns all the sales from the database.
 * @param ctx 
 * @returns All the sales from the database
 */
export async function getSales(ctx: Context) {
	const sales = await findSalesService();
	return ctx.json(sales);
}

/**
 * Get Sale Controller function that returns a sale from the database.
 * @param ctx 
 * @returns A sale from the database
 */
export async function getSaleById(ctx: Context) {
	const { id } = ctx.req.param();
	const sale = await findSaleByIdService(id)
	return ctx.json(sale);
}

/**
 * Create Sale Controller function that creates a sale in the database.
 * @param ctx 
 * @returns The created sale
 */
export async function createSale(ctx: Context) {
	const data = ctx.get("validatedData");
	console.log(data);
	const createdSale = await createSaleService(data)
	return ctx.json(createdSale);
}

/**
 * Update Sale Controller function that updates a sale in the database.
 * @param ctx 
 * @returns The updated sale
 */
export async function updateSale(ctx: Context) {
	const { id } = ctx.req.param();
	const data = ctx.get("validatedData");
	const updatedSale = await updateSaleService(id, data);
	return ctx.json(updatedSale);
}

/**
 * Delete Sale Controller function that deletes a sale from the database.
 * @param ctx 
 * @returns The deleted sale
 */
export async function deleteSale(ctx: Context) {
	const { id } = ctx.req.param();
	const deletedSale = await deleteSaleService(id);
	return ctx.json(deletedSale);
}

// ---- Not CRUD operations ----
/**
 * Mark Sale As Paid Controller function that marks a sale as paid by client in the database.
 * @param ctx 
 * @returns The Number of sales updated
 */
export async function markAllSalesAsPaidByClientController(ctx: Context) {
	const { clientId } = ctx.req.param();

	// Call the service 
	const updatedSales = await markAllSalesAsPaidByClientService(clientId);

	// Return the updated sales
	return ctx.json(updatedSales); // this return a number of sales updated not the sales
}

/**
 * Mark Sale As Paid Controller function that marks a sale as paid in the database.
 * @param ctx 
 * @returns The updated sale
 */
export async function markSaleAsPaidController(ctx: Context) {
	const { id } = ctx.req.param();

	// Call the service
	const updatedSale = await markSaleAsPaidService(id);
	// Return the updated sale
	return ctx.json(updatedSale);
}

/**
 * Mark Sale As Pending Controller function that marks a sale as pending in the database.
 * @param ctx 
 * @returns The updated sale
 */
export async function markSaleAsPendingController(ctx: Context) {
	const { id } = ctx.req.param();

	// Call the service
	const sale = await markSaleAsPendingService(id);

	// Return the updated sale
	return ctx.json(sale);
}