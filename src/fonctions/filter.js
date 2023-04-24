import {
    FILTRE_PRIX_CROISSANT_STRING,
    FILTRE_PRIX_DECROISSANT_STRING,
    FILTRE_ALPHABETIQUE_CROISSANT_STRING,
    FILTRE_ALPHABETIQUE_DECROISSANT_STRING,
    FILTRE_DELAIS_1_5,
    FILTRE_DELAIS_6_10,
    FILTRE_DELAIS_11_20,
    FILTRE_DELAIS_20_SUP
} from '../const/filtre';

/*
* Cette fonction permet d'appliquer un tri en fonction du type de tri en entrée.
* Il y a 4 types de tri : par prix croissant/décroissant et par ordre alphabétique croissant/décroissant
*/
function sortSwitch(produitsTries, sortType) {
    switch (sortType) {
        case FILTRE_PRIX_CROISSANT_STRING:
            produitsTries.sort((a,b) => a.prix - b.prix);
            break;
        case FILTRE_PRIX_DECROISSANT_STRING:
            produitsTries.sort((a,b) => b.prix - a.prix);
            break;
        case FILTRE_ALPHABETIQUE_CROISSANT_STRING:
            produitsTries.sort((a,b) => {
                if(a.nom < b.nom) return -1;
                if( a.nom > b.nom) return 1;
                return 0;
            });
            break;
        case FILTRE_ALPHABETIQUE_DECROISSANT_STRING:
            produitsTries.sort((a,b) => {
                if(a.nom < b.nom) return 1;
                if( a.nom > b.nom) return -1;
                return 0;
            });
            break;
        default:
            console.log("switchSort error");
            break;
    }
}

function delaisLivraisonSwitch(produitsTries, delaisLivraisonType) {
    switch (delaisLivraisonType) {
        case FILTRE_DELAIS_1_5:
            return produitsTries.filter((produit) => {
                return produit.delaisLivraison <= 5;
            });
            break;
        case FILTRE_DELAIS_6_10:
            return produitsTries.filter((produit) => {
                return produit.delaisLivraison > 5 && produit.delaisLivraison <= 10;
            });
            break;
        case FILTRE_DELAIS_11_20:
            return produitsTries.filter((produit) => {
                return produit.delaisLivraison > 10 && produit.delaisLivraison <= 20;
            });
            break;
        case FILTRE_DELAIS_20_SUP:
            return produitsTries.filter((produit) => {
                return produit.delaisLivraison > 20;
            });
            break;
        default:
            console.log("delaisLivraisonSwitch error");
            break;
    }
}

/*
* Cette fonction filtre les produits n'ayant aucun stock.
*
* Valeur de retour : le tableau des produits sans ceux n'ayant pas de stock.
*/
function stockFilter(produitsTries) {
    return produitsTries.filter((produit) => {
        return produit.stock > 0;
    });
}

/*
* Cette fonction filtre les produits n'ayant pas de réduction.
*
* Valeur de retour : le tableau des produits sans ceux n'ayant pas de réduction.
*/
function reductionFilter(produitsTries) {
    return produitsTries.filter((produit) => {
        return produit.reduction > 0;
    });
}

/*
* Le filtre crée des bugs, nous n'avons pas eu le temps de le finir.
*/
// function vendeurFilter(produitsTries, vendeurArray, utilisateursVendeursArray) {
//     const vendeursEntreprises = vendeurArray.filter((vendeur) => {
//         return utilisateursVendeursArray.includes(vendeur.idEntreprise);
//     }).map((vendeur) => {
//         return vendeur.idVendeur;
//     });
//     console.log(vendeursEntreprises);
//     return produitsTries.filter((produit) => {
//         return vendeursEntreprises.includes(produit.idVendeur);
//     });
// }

/*
* Cette fonction permet d'appliquer le tri et tous les filtres sélectionnés par l'utilisateur.
*
* Valeur de retour : le tableau des produits, trié et filtré.
*/
export function updateProducts(produits, actualSort) {
    let produitsTries = produits;

    if(actualSort.stockCheckbox) produitsTries = stockFilter(produitsTries);
    if(actualSort.reductionCheckbox) produitsTries = reductionFilter(produitsTries);
    // if(actualSort.utilisateursVendeursArray.length > 0) produitsTries = vendeurFilter(produitsTries, actualSort.vendeurArray, actualSort.utilisateursVendeursArray);
    if(actualSort.delaisLivraisonType != false) produitsTries = delaisLivraisonSwitch(produitsTries, actualSort.delaisLivraisonType);
    if(actualSort.sortType != false) sortSwitch(produitsTries, actualSort.sortType);

    return produitsTries;
}
