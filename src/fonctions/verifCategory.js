/*
* Fonction permettant de vérifier la validité des informations entrées par l'admin lors de la création d'une catégorie.
* On vérifie que les champs 'libelle' et 'description' ne soient pas vides.
*
* Valeur de retour : un objet 'errors' contenant des booléens correspondant à la présence d'une erreur ou non pour chaque champs.
*/
export default function verifCategory(product) {

    const errors = {
        libelle: false,
        description: false,
    }

    if(product.libelle.length == 0) errors.libelle = true;
    if(product.description.length == 0) errors.description = true;

    return errors;

}