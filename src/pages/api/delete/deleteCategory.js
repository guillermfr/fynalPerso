import { prisma } from "../../../../db";

/*
* Cet handler permet de supprimer une catégorie
*/
export default async function handler(req, res) {
    // On récupère les informations
    let categorie = req.body;

    // On supprime la catégorie en question
    const categorieSupprimee = await prisma.categorie.delete({
        where: {
            idCategorie: categorie.idCategorie,
        },
    });

    res.status(200).json({ data: "ok" });
}