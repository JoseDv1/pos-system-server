
import { ErrorBadRequest } from "@/errors/errors";
import { prisma } from "@/lib/prisma";
import { checkIfClientExist } from "./validationServices";


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