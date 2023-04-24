import { prisma } from "../../db";

export async function getProductIndex() {

    const produits = await prisma.produit.findMany({
        orderBy: [
            {
                idProduit: 'desc',
            },
        ],
        take: 4,
    });

    return {
        produits,
    }
}