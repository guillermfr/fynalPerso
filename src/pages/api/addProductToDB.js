import { prisma } from "../../../db";
import verifProduct from "../../fonctions/verifProduct";

/*
* Cet handler permet de récupérer les informations entrées par un vendeur sur un produit qu'il souhaite ajouter.
*
* Valeur de retour : un message contenant les erreurs s'il y en a, sinon un message pour signaler qu'il n'y a pas eu de problème.
*/
export default async function handler(req, res) {
    // On récupère les informations
    let produit = req.body;

    // On récupère les informations sur les catégories, et en particulier les IDs, pour pouvoir vérifier si l'ID entré par le vendeur existe bien.
    const categories = await prisma.categorie.findMany({
        where: {},
        select: {
            idCategorie: true,
        }
    });
    const idCategories = categories.map((categorie) => {
        return categorie.idCategorie;
    });

    const vendeur = await prisma.vendeur.findMany({
        where: {
            idUtilisateur: parseInt(produit.vendeur),
        },
    });

    // On vérifie s'il y a des erreurs dans les informations entrées par le vendeur
    const errors = verifProduct(produit, idCategories);

    // On convertie les valeurs entrées pour qu'il n'y ait pas de conflit avec la BDD
    produit.stock = parseInt(produit.stock);
    produit.delaisLivraison = parseInt(produit.delaisLivraison);
    produit.prix = parseFloat(produit.prix);

    if(produit.reduction === '') produit.reduction = null;
    else produit.reduction = parseInt(produit.reduction);

    if(produit.hauteur === '') produit.hauteur = null;
    else produit.hauteur = parseInt(produit.hauteur);

    if(produit.longueur === '') produit.longueur = null;
    else produit.longueur = parseInt(produit.longueur);

    if(produit.largeur === '') produit.largeur = null;
    else produit.largeur = parseInt(produit.largeur);

    if(produit.poids === '') produit.poids = null;
    else produit.poids = parseInt(produit.poids);

    if(produit.categorie === '') produit.categorie = undefined;
    else produit.categorie = parseInt(produit.categorie);

    // Si l'objet 'errors' contient au moins une erreur, on renvoie un message contenant les erreurs en question
    // Sinon, on ajoute le produit dans la BDD et on renvoie un message pour signaler qu'il n'y a pas eu de problème.
    if(Object.values(errors).includes(true)) res.status(200).json({ data: errors });
    else {
        const produitAjoute = await prisma.produit.create({
            data: {
                nom: produit.nom,
                reference: produit.reference,
                description: produit.description,
                stock: produit.stock,
                delaisLivraison: produit.delaisLivraison,
                prix: produit.prix,
                reduction: produit.reduction,
                hauteur: produit.hauteur,
                longueur: produit.longueur,
                largeur: produit.largeur,
                poids: produit.poids,
                image: produit.image,
                Categorie: {
                    ...(produit.categorie
                        ? {
                            connect: {
                                idCategorie: produit.categorie,
                            },
                        }
                        : undefined 
                    )
                },
                Vendeur: {
                    connect: {
                        idVendeur: vendeur[0].idVendeur,
                    },
                },
            },
        });
        res.status(200).json({ data: "ok" });
    }
}