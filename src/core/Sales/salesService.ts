
import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import { PaymentMethod, Sale } from "@prisma/client";


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

// ---- CRUD ----
export const findSalesService = async () => {
	const sales = await prisma.sale.findMany(
		{
			include: {
				client: true,
				saleProducts: {
					include: {
						product: true
					}
				}
			}
		}
	);
	return sales;
}

export const findSaleByIdService = async (id: string) => {
	const sale = await prisma.sale.findUnique({
		where: {
			id: id
		},
		include: {
			client: true,
			saleProducts: true,
		}
	});

	if (!sale) {
		throw new ErrorNotFound("Sale not found");
	}

	return sale;
}

export const createSaleService = async (data: Pick<Sale, "clientId">) => {
	const createdSale = await prisma.sale.create({
		data: {
			clientId: data.clientId,
		},
		include: {
			client: true
		}
	});

	return createdSale
}

export const updateSaleService = async (id: string, data: Partial<Sale>) => {
	if (!data.clientId && !data.paymentMethod && !data.totalCost && !data.status && !data.note) {
		throw new ErrorBadRequest("At least one field is required");
	}
	// Update the sale
	const updatedSale = await prisma.sale.update({
		where: {
			id,
		},
		data,
		include: {
			client: true
		}
	});

	return updatedSale
}

export const deleteSaleService = async (id: string) => {
	// Delete the sale
	const deletedSale = await prisma.sale.delete({
		where: {
			id: id
		}
	});

	return deletedSale;
}


// ---- Not CRUD Operations ----
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

export async function getSalesReportByDateService(from: string, to: string) {
	// Get the sales using a raw sql query ordered by date and grouped by date with the sum of the total cost on that day
	const sales = await prisma.$queryRaw`
		SELECT 
			date_trunc('day', "createdAt") as date,
			SUM("totalCost") as total
		FROM 
			"sales"
		WHERE 
		"createdAt" >= to_date(${from}, 'YYYY-MM-DD') AND "createdAt" <= to_date(${to}, 'YYYY-MM-DD')
		GROUP BY 
			date
		ORDER BY 
			date
	`;

	const supplies = await prisma.$queryRaw`
        SELECT 
            date_trunc('day', "date") as date,
            SUM("totalCost") as total
        FROM 
            "supplies"
        WHERE 
        "date" >= to_date(${from}, 'YYYY-MM-DD') AND "date" <= to_date(${to}, 'YYYY-MM-DD')
        GROUP BY 
            date_trunc('day', "date")
        ORDER BY 
            date_trunc('day', "date")
    `;

	console.log(supplies)

	return {
		sales,
		supplies
	}
}

export async function setPaymentMethodService(id: string, paymentMethod: PaymentMethod) {
	await checkIfSaleExist(id);

	const updatedSale = await prisma.sale.update({
		where: {
			id: id
		},
		data: {
			paymentMethod,
		}
	});

	return updatedSale;
}