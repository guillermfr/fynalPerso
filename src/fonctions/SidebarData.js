import { prisma } from '../../db';

/*
* Cette fonction permet de récupérer les informations sur les catégories dans la BDD et ensuite générer le lien permettant d'y accéder.
* Cette fonction est utilisé pour afficher les catégories dans le menu ouvrable à gauche.
* 
* Valeur de retour : tableau contenant le nom des catégories ainsi que le lien permettant d'y accéder.
*/
export async function getCategorieIdData() {
    const categories = await prisma.categorie.findMany();

    const sidebarCategories = categories.map((categorie) => {
        return({
            title: categorie.libelle,
            path: '/categorie/'.concat(categorie.idCategorie),
        })
    });

    return sidebarCategories;
}