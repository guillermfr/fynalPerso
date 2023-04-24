import Link from "next/link";
import { PrixProduitCategorie } from "./PrixProduitCategorie";

/*
* Component permettant d'afficher une 'carte' produit.
* Ce component est utilisé dans les pages catégories, après une recherche, et sur la page d'accueil
* Une 'carte' produit contient les informations principales sur le produit (image, nom, prix), mais aussi un bouton permettant de directement l'ajouter au panier
*/
export const ProductCard = ({ produit, cart, idUtilisateur, handleNewCartData }) => {
    return (
        <div className='group'>
            <Link
                href={`/products/${produit.idProduit}`}
            >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <img
                    src={produit.image}
                    alt={produit.nom}
                    height={10}
                    width={10}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                </div>
            </Link>
            <div className='flex flex-row'>
                <div>
                <h3 className="mt-4 text-sm text-gray-700">
                    {produit.nom}
                </h3>
                <PrixProduitCategorie prix={produit.prix} reduction={produit.reduction}></PrixProduitCategorie>
                </div>
                <button className="mt-7 text-normal px-3 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none"
                    onClick={async (e) => {
                        try {
                        await handleNewCartData(produit, cart, idUtilisateur);
                        e.target.reset();
                        } catch (err) {
                        console.log(err);
                        }
                    }}
                >
                    Ajouter au panier
                </button>
            </div>
        </div>
    )
}