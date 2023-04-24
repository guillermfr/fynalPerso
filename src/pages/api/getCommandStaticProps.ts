import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { idUtilisateur } = req.body;

  try {
    const user = await prisma.commande.findMany({
      where: { idUtilisateur: idUtilisateur, etatCommande: 0 },
      include: {
        PanierProduit: true,
      },
    });
    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
