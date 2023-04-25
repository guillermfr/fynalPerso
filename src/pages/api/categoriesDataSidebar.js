import { prisma } from "../../../db";

export default async function handler(req, res) {
    const categories = await prisma.categorie.findMany();

    const sidebarCategories = categories.map((categorie) => {
        return({
            title: categorie.libelle,
            path: '/categorie/'.concat(categorie.idCategorie),
        })
    });

    res.status(200).json(sidebarCategories);
}
