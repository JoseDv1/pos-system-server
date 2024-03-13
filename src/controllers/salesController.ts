import { Context } from "hono";
import { prisma } from "@/lib/prisma";
import { $Enums, type Sale } from "@prisma/client";
import { ErrorBadRequest, ErrorNotFound } from "@/errors/errors";
import { markAllSalesAsPaidByClientService, markSaleAsPaidService, markSaleAsPendingService } from "@/services/salesService";

/**
 * Get Sales Controller function that returns all the sales from the database.
 * @param ctx 
 * @returns All the sales from the database
 */
export async function getSales(ctx: Context) {
	const { productsSales } = ctx.req.query();


	const sales: Sale[] = await prisma.sale.findMany(
		{
			include: {
				client: true,
				saleProducts: Boolean(productsSales),
			}
		}
	);

	if (!sales) {
		throw new ErrorNotFound("Sales not found");
	}

	return ctx.json(sales);
}

/**
 * Get Sale Controller function that returns a sale from the database.
 * @param ctx 
 * @returns A sale from the database
 */
export async function getSaleById(ctx: Context) {
	const { id } = ctx.req.param();
	const { clients, productsSales } = ctx.req.query()

	const sale = await prisma.sale.findUnique({
		where: {
			id: id
		},
		include: {
			client: Boolean(clients),
			saleProducts: Boolean(productsSales),
		}
	});

	if (!sale) {
		throw new ErrorNotFound("Sale not found");
	}

	return ctx.json(sale);
}

/**
 * Create Sale Controller function that creates a sale in the database.
 * @param ctx 
 * @returns The created sale
 */
export async function createSale(ctx: Context) {
	const body: Sale = await ctx.req.json();
	const { clientId, paymentMethod } = body

	// Check if the fields are not empty
	if (!clientId) {
		throw new ErrorBadRequest("All fields are required");
	}

	// Check if the paymentMethod is valid
	if (paymentMethod && !$Enums.PaymentMethod[paymentMethod]) {
		throw new ErrorBadRequest("Invalid payment method");
	}

	// Check if the client exists
	const client = await prisma.client.findUnique({
		where: {
			id: clientId
		}
	});


	if (!client) {
		throw new ErrorNotFound("Client not found");
	}

	// Create a sale
	const sale = await prisma.sale.create({
		data: {
			clientId,
			paymentMethod,
		},
		include: {
			client: true
		}
	});

	if (!sale) {
		throw new ErrorBadRequest("Sale not created");
	}

	// Return the created sale
	return ctx.json(sale);
}

/**
 * Update Sale Controller function that updates a sale in the database.
 * @param ctx 
 * @returns The updated sale
 */
export async function updateSale(ctx: Context) {
	const { id } = ctx.req.param();
	const body: Sale = await ctx.req.json();
	const { clientId, paymentMethod, totalCost, status } = body

	// Check if almost one field is not empty
	if (!clientId && !paymentMethod && !totalCost && !status) {
		throw new ErrorBadRequest("At least one field is required");
	}

	// Check if the paymentMethod is valid
	if (paymentMethod && !$Enums.PaymentMethod[paymentMethod]) {
		throw new ErrorBadRequest("Invalid payment method");
	}

	// Check if the status is valid
	if (status && !$Enums.Status[status]) {
		throw new ErrorBadRequest("Invalid sale status");
	}


	if (clientId) {
		// Check if the client exists
		const client = await prisma.client.findUnique({
			where: {
				id: clientId
			}
		});

		if (!client) {
			throw new ErrorNotFound("Client not found");
		}
	}

	// Check if the sale exists
	const saleExists = await prisma.sale.findUnique({
		where: {
			id: id
		}
	});

	if (!saleExists) {
		throw new ErrorNotFound("Sale not found");
	}

	// Update the sale
	const sale = await prisma.sale.update({
		where: {
			id: id
		},
		data: {
			clientId,
			paymentMethod,
			totalCost,
			status
		}
	});

	// Return the updated sale
	return ctx.json(sale);
}

/**
 * Delete Sale Controller function that deletes a sale from the database.
 * @param ctx 
 * @returns The deleted sale
 */
export async function deleteSale(ctx: Context) {
	const { id } = ctx.req.param();

	// Check if the sale exists
	const saleExists = await prisma.sale.findUnique({
		where: {
			id: id
		}
	});

	if (!saleExists) {
		throw new ErrorNotFound("Sale not found");
	}

	// Delete the sale
	const sale = await prisma.sale.delete({
		where: {
			id: id
		}
	});

	// Return the deleted sale
	return ctx.json(sale);
}

// --- Not CRUD operations ---

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