import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "error method" });
  }
  const cartData = JSON.parse(req.body);

  console.log(cartData);

  if (cartData.idCommande === 0) {
    const newCommand = await prisma.commande.create({
      data: {
        etatCommande: 0,
        idUtilisateur: cartData.idUtilisateur,
        PanierProduit: {
          create: [
            {
              idProduit: cartData.idProduit,
              quantite: cartData.quantite,
            },
          ],
        },
      },
    });
    const returnData = await prisma.commande.findUnique({
      where: { idCommande: newCommand.idCommande },
      include: {
        PanierProduit: {
          include: {
            Produit: true,
          },
        },
      },
    });

    res.json(returnData);
  } else {
    const newCartData =
      cartData.exist === true
        ? await prisma.panierProduit.updateMany({
            where: {
              idProduit: cartData.idProduit,
              idCommande: cartData.idCommande,
            },
            data: {
              quantite: cartData.quantite,
            },
          })
        : await prisma.panierProduit.create({
            data: {
              idCommande: cartData.idCommande,
              idProduit: cartData.idProduit,
              quantite: cartData.quantite,
            },
          });

    const returnData = await prisma.commande.findUnique({
      where: { idCommande: cartData.idCommande },
      include: {
        PanierProduit: {
          include: {
            Produit: true,
          },
        },
      },
    });

    res.json(returnData);
  }

  // const newCartData = await prisma.panierProduit.create({
  //     data: cartData

  // })
};
