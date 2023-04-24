import { useState } from "react";
import { useRouter } from "next/router";
import { getCategorieIdData } from "../fonctions/SidebarData";
import { CategoryForm } from "../components/CategoryForm";

export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    
    return {
        props: {
            categoriesSideMenu: categoriesSideMenu,
        },
    };
}

const errorsDefault = {
    libelle: false,
    description: false,
}

/*
* Fonction permettant de créer une caétgorie.
*/
export default function AddCategory() {

    const [errors, setErrors] = useState(errorsDefault);
    const [buttonState, setButtonState] = useState(false);

    const router = useRouter();

    // On récupère les informations entrées grâce à un form, on traite ensuite ces informations grâce à une API route
    const handleSubmit = async (event) => {
        setButtonState(true);
        event.preventDefault();

        const data = {
            libelle: event.target.libelle.value,
            description: event.target.description.value,
        };

        const JSONdata = JSON.stringify(data);

        const endpoint = '/api/addCategoryToDB';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);
        const result = await response.json();

        if(result.data === "ok") router.push('/manageCategory');
        else {
            setButtonState(false);
            setErrors(result.data);
        }
        
    }

    return(
        <div>
            <h1 className='text-center mt-8 font-semibold text-3xl italic'>Ajouter une categorie</h1>
            <h2 className='block text-gray-500 font-bold mt-5 ml-5 md:mb-0 pr-4'>Pour ajouter une catégorie, remplissez les champs suivants et appuyez sur le bouton en fin de page pour confirmer. Les champs avec une étoile doivent être obligatoirement remplis.</h2>
            <CategoryForm handleSubmit={handleSubmit} buttonState={buttonState} errors={errors} type={0}></CategoryForm>
        </div>
    );
}
