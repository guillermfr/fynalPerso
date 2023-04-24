import { prisma } from "../../../../db";
import verifCategory from "../../../fonctions/verifCategory";

/*
* Cet handler permet de récupérer les informations entrées par l'administrateur sur une catégorie qu'il souhaite modifier.
*
* Valeur de retour : un message contenant les erreurs s'il y en a, sinon un message pour signaler qu'il n'y a pas eu de problème.
*/
export default async function handler(req, res) {
    // On récupère les informations
    let categorie = req.body;

    // On vérifie s'il y a des erreurs dans les informations entrées par l'administrateur
    const errors = verifCategory(categorie);

    // Si l'objet 'errors' contient au moins une erreur, on renvoie un message contenant les erreurs en question
    // Sinon, on modifie la catégorie dans la BDD et on renvoie un message pour signaler qu'il n'y a pas eu de problème.
    if(Object.values(errors).includes(true)) res.status(200).json({ data: errors });
    else {
        const categorieModifiee = await prisma.categorie.update({
            where: {
                idCategorie: categorie.idCategorie,
            },
            data: {
                libelle: categorie.libelle,
                description: categorie.description,
            }
        });
        res.status(200).json({ data: "ok" });
    }
}