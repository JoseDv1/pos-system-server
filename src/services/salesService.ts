
import { ErrorBadRequest } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { checkIfClientExist, checkIfSaleExist } from "./validationServices";


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