import { prixReductionArrondi } from "../fonctions/prixReductionArrondi"

/*
* Component servant à afficher le prix d'un produit sur la page produit.
* Le prix affiché dépend de la présence ou non d'une réduction.
*/
export const PrixProduitProduit = ({ prix, reduction, stock }) => {
    if(stock > 0) {
        if(reduction > 0) {
            return(
                <div>
                    <div className="flex gap-3">
                        <div className="title-font font-medium text-2xl text-gray-400 line-through">
                            {prix} €
                        </div>
                        <p className="title-font font-bold text-2xl text-red-600"> 
                            -{reduction}%
                        </p>
                    </div>
                    <span className="title-font font-medium text-2xl text-gray-900">
                        {prixReductionArrondi(prix, reduction)} €
                    </span>
                </div>
            )
        } else {
            return (
                <span className="title-font font-medium text-2xl text-gray-900">
                    {prixReductionArrondi(prix, reduction)} €
                </span>
            )
        }
    } else {
        return(
            <span className="title-font font-bold text-2xl text-red-600">
                Rupture de stock
            </span>
        )
    }
}