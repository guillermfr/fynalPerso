/*
* Component permettant d'afficher une erreur.
* Ce component est utilisé dans les pages permettant d'ajouter un produit ou une catégorie.
* On teste simplement s'il y a une erreur, et si oui, on affiche qu'il y en a une.
*/
export const ErrorDiv = ({ children, condition }) => {
    if(condition === 'true') {
        return(
            <div className="text-red-600 font-bold md:text-right">{children}</div>
        )
    }
    else return null;
}