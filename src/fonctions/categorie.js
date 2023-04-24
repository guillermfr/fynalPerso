import { prisma } from "../../db";
import arrayUnique from "./uniqueValuesFromArray";

/*
* Cette fonction permet de récupérer tous les chemins possibles pour les catégories. Pour cela, on va chercher l'ID de chaque catégorie dans la BDD
*
* Valeur de retour : tableau d'objets dans lequels sont contenus l'ID de chaque catégorie.
*/
export async function getAllCategoriesID() {
    const categories = await prisma.categorie.findMany({
        where: {},
        select: {
            idCategorie: true,
        }
    });

    const paths = categories.map((categorie) => ({
        params: { id: categorie.idCategorie.toString() },
    }));

    return paths;
}

/*
* Cette fonction permet de récupérer les informations de tous les produits associés à la catégorie sélectionnée ainsi que les informations sur les vendeurs et les entreprises
* pour pouvoir définir les filtres.
*
* Valeur de retour : tableau d'objets dans lequels sont contenus les produits, les informations sur les vendeurs, les entreprises
*/
export async function getCategorieProductsData(id) {
    const categorie = await prisma.categorie.findMany({
        where: {
            idCategorie: parseInt(id),
        }
    });

    const produits = await prisma.produit.findMany({
        where: {
            idCategorie: parseInt(id),
        }
    });

    const vendeurFiltre = arrayUnique( 
        produits.map((produit) => { 
            return produit.idVendeur 
        })
    );
    const vendeurs = await prisma.vendeur.findMany({
        select: {
            idVendeur: true,
            idUtilisateur: true,
        },
        where: {
            idVendeur: { in: vendeurFiltre },
        }
    });

    // const utilisateursVendeursFiltre = arrayUnique( 
    //     vendeurs.map((vendeur) => { 
    //         return vendeur.idUtilisateur 
    //     })
    // );

    // const utilisateursVendeurs = await prisma.utilisateur.findMany({
    //     where: {
    //         idUtilisateur: { in: utilisateursVendeursFiltre }
    //     },
    //     select: {
    //         idUtilisateur: true,
    //         nom: true,
    //         prenom: true,
    //     }
    // })

    return {
        id,
        produits,
        vendeurs,
        // utilisateursVendeurs,
        ...categorie,
    }
}
