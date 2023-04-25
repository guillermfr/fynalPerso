import {
    verifIntPositive,
    verifFloatPositive,
} from "./verifIntFloat";

/*
* Fonction permettant de vérifier la validité des informations entrées par un vendeur lors de la création d'une produit.
* On vérifie que tous les champs soient valides.
*
* Valeur de retour : un objet 'errors' contenant des booléens correspondant à la présence d'une erreur ou non pour chaque champs.
*/
export default function verifProduct(product, idCategories) {

    const errors = {
        nom: false,
        reference: false,
        description: false,
        stock: false,
        delaisLivraison : false,
        prix: false,
        reduction: false,
        hauteur: false,
        longueur: false,
        largeur: false,
        poids: false,
        image: false,
        categorie: false,
        vendeur: false,
    }

    if(product.nom.length == 0) errors.nom = true;
    if(product.reference.length == 0) errors.reference = true;
    if(product.description.length == 0) errors.description = true;

    if(!verifIntPositive(product.stock, 0)) errors.stock = true;
    if(!verifIntPositive(product.delaisLivraison, 1)) errors.delaisLivraison = true;
    if(!verifFloatPositive(product.prix, 1)) errors.prix = true;
    if(product.reduction.length != 0 && !verifIntPositive(product.reduction, 0)) errors.reduction = true;
    if(product.hauteur.length != 0 && !verifFloatPositive(product.hauteur, 1)) errors.hauteur = true;
    if(product.longueur.length != 0 && !verifFloatPositive(product.longueur, 1)) errors.longueur = true;
    if(product.largeur.length != 0 && !verifFloatPositive(product.largeur, 1)) errors.largeur = true;
    if(product.poids.length != 0 && !verifFloatPositive(product.poids, 1)) errors.poids = true;
    // Pas vraiment possible de faire un test pour le lien de l'image ?
    if(!verifIntPositive(product.categorie, 1) || !idCategories.includes(parseInt(product.categorie))) {
        if(product.categorie.length != 0) errors.categorie = true;
    }
    // Pas besoin de faire de test sur le vendeur

    return errors;

}