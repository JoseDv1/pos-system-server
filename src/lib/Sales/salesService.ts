
import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";


/**
 * Function to check if a client exists in the database by its id
 * @param clientId 
 * @returns the client if it exists
 */
export async function checkIfClientExist(clientId: string) {
	// Validate if the client exists
	const client = await prisma.client.findUnique({
		where: { id: clientId }
	});

	if (!client) {
		throw new ErrorNotFound("Client not found 404");
	}

	return client;
}

/**
 * Function to check if a sale exists in the database by its id
 * @param saleId 
 * @returns the sale if it exists
 */
export async function checkIfSaleExist(saleId: string) {
	// Validate if the sale exists
	const sale = await prisma.sale.findUnique({
		where: { id: saleId }
	});

	if (!sale) {
		throw new ErrorNotFound("Sale not found 404");
	}

	return sale;
}

export const markAllSalesAsPaidByClientService = async (clientId: string) => {
	// Check if the client exists
	await checkIfClientExist(clientId);

	// Update the sales
	const updatedSales = await prisma.sale.updateMany({
		where: {
			clientId: clientId,
			createdAt: {
				gte: new Date(new Date().setHours(0, 0, 0, 0))
			}
		},
		data: {
			status: "PAYED",
		},
	})

	if (!updatedSales) {
		throw new ErrorBadRequest("Error updating sales");
	}

	return updatedSales;
}

export const markSaleAsPaidService = async (id: string) => {
	await checkIfSaleExist(id);

	// Update the sale
	const payedSale = await prisma.sale.update({
		where: {
			id: id
		},
		data: {
			status: "PAYED"
		}
	});

	return payedSale;

}

export const markSaleAsPendingService = async (id: string) => {
	await checkIfSaleExist(id);

	// Update the sale
	const pendingSale = await prisma.sale.update({
		where: {
			id: id
		},
		data: {
			status: "PENDING"
		}
	});

	return pendingSale;
}