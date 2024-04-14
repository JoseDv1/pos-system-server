import { ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import { Supply } from "@prisma/client";

export async function findSupplies() {
	// Get all supplies
	const supplies = await prisma.supply.findMany({
		include: {
			provider: true
		}
	});
	return supplies;
}


export async function findSupplyById(id: string) {
	const supply = await prisma.supply.findUnique({
		where: { id: id },
		include: {
			provider: true
		}
	});
	return supply;
}

export async function createSupplyService(data: Pick<Supply, "providerId">) {
	const newSupply = await prisma.supply.create({
		data,
		include: {
			provider: true
		}
	});
	return newSupply;
}

export async function updateSupplyService(id: string, data: Partial<Pick<Supply, "providerId" | "totalCost">>) {
	// Check if almost one field is provided
	if (!data.totalCost && !data.providerId) {
		throw new ErrorNotFound("At least one field is required");
	}
	// Update the supply
	const updatedSupply = await prisma.supply.update({
		where: { id: id },
		data,
	});
	return updatedSupply;
}


export async function deleteSupplyService(id: string) {
	const deletedSupply = await prisma.supply.delete({
		where: { id: id },
	});
	return deletedSupply;
}