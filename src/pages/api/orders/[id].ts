import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const order = prisma.commande.findUnique({
    where: {
      idCommande: Number(req.query.id),
    },
    include: {
      PanierProduit: {
        include: {
          Produit: true,
        },
      },
      Adresse: true,
      Utilisateur: true,
    },
  });

  res.json(order);
};
