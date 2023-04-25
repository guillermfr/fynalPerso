import { prisma } from "../../../db";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAllCategoriesID } from "../../fonctions/categorie";
import { CategoryForm } from "../../components/CategoryForm";

// On récupère tous les chemins possibles 
export async function getStaticPaths() {
    const paths = await getAllCategoriesID();
    
    return {
        paths,
        fallback: false,
    }
}

// On récupère les informations nécessaires en fonction du chemin
export async function getStaticProps({ params }) {
    const catData = await prisma.categorie.findMany({
        where: {
            idCategorie: parseInt(params.id),
        }
    });
    
    return {
        props: {
            catData: catData,
        },
    };
}

const errorsDefault = {
    libelle: false,
    description: false,
}

/*
* Fonction permettant de modifier les informations d'une caétgorie.
*/
export default function ModifCategory({ catData }) {

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
            idCategorie : catData[0].idCategorie,
        };

        const JSONdata = JSON.stringify(data);

        const endpoint = '/api/modif/modifCategory';

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

    return (
        <div>
            <CategoryForm handleSubmit={handleSubmit} buttonState={buttonState} errors={errors} type={1}></CategoryForm>
        </div>
    )
}
