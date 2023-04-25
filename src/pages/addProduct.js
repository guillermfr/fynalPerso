import { useState } from "react";
import { useRouter } from "next/router";
import { ErrorDiv } from "../components/ErrorDiv";
import { useCookies } from "react-cookie";

// On définie tous les types d'erreur possibles
const errorsDefault = {
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

/*
* Cette page permet à un vendeur d'ajouter un produit.
* Il a accès à un formulaire dans lequel il indique les caractéristiques du produit qu'il veut ajouter.
*/
export default function AddProduct() {

    const [errors, setErrors] = useState(errorsDefault);
    const [buttonState, setButtonState] = useState(false);

    const [cookies] = useCookies(["user"]);

    const router = useRouter();

    // Gestion du formulaire
    // On récupère les informations entrées, et on les envoie à l'API où elles seront vérifiées puis envoyer sur la BDD s'il n'y a pas de problème
    const handleSubmit = async (event) => {
        setButtonState(true);
        event.preventDefault();

        if (!cookies["user"]) {
            alert("Veuillez vous connecter pour ajouter un produit");
            router.push("/signin");
        }

        const data = {
            nom: event.target.nom.value,
            reference: event.target.reference.value,
            description: event.target.description.value,
            stock: event.target.stock.value,
            delaisLivraison: event.target.delaisLivraison.value,
            prix: event.target.prix.value,
            reduction: event.target.reduction.value,
            hauteur: event.target.hauteur.value,
            longueur: event.target.longueur.value,
            largeur: event.target.largeur.value,
            poids: event.target.poids.value,
            image: event.target.image.value,
            categorie: event.target.categorie.value,
            vendeur: cookies?.user?.idUtilisateur,
        };

        const JSONdata = JSON.stringify(data);

        const endpoint = '/api/addProductToDB';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if(result.data === "ok") router.push('/successAddProduct');
        else {
            setButtonState(false);
            setErrors(result.data);
        }
        
    }

    // Définition des champs du formulaire
    const formFields = [
        { labelString: "Nom* :", id: "nom" },
        { labelString: "Référence* :", id: "reference" },
        { labelString: "Description* :", id: "description" },
        { labelString: "Stock* :", id: "stock" },
        { labelString: "Delais de livraison* :", id: "delaisLivraison" },
        { labelString: "Prix* :", id: "prix" },
        { labelString: "Réduction :", id: "reduction" },
        { labelString: "Hauteur :", id: "hauteur" },
        { labelString: "Longueur :", id: "longueur" },
        { labelString: "Largeur :", id: "largeur" },
        { labelString: "Poids :", id: "poids" },
        { labelString: "Lien de l'image* :", id: "image" },
        { labelString: "Catégorie :", id: "categorie" }
    ]

    return(
        <div>
            <h1 className='text-center mt-8 font-semibold text-3xl italic'>Ajouter un produit</h1>
            <h2 className='block text-gray-500 font-bold mt-5 ml-5 md:mb-0 pr-4'>Pour ajouter un produit, remplissez les champs suivants et appuyez sur le bouton en fin de page pour confirmer. Les champs avec une étoile doivent être obligatoirement remplis.</h2>
            <div className="flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-sm mt-5">
                    { formFields.map((formField) => {
                        return (
                            <div key={formField.id} className="mb-6">
                                <div className="md:flex md:items-center">
                                    <div className="md:w-1/3">
                                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor={formField.id}>{formField.labelString}</label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" id={formField.id}></input>
                                    </div>
                                </div>
                                <ErrorDiv condition={errors[formField.id.toString()].toString()}>Ce champs n'est pas valide.</ErrorDiv>
                            </div>
                        );
                    }) }
                    <div className="md:flex md:items-center mb-20">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button type="submit" disabled={buttonState} className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Ajouter</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
