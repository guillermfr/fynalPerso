import { ErrorDiv } from "./ErrorDiv"

// Définition des champs du formulaire
const formFields = [
    { labelString: "Libellé* :", id: "libelle" },
    { labelString: "Description* :", id: "description" },
]

// En fonction du form, on veut soit modifier soit supprimer une catégorie
function typeForm(type) {
    if(type == 0) {
        return "Ajouter";
    } else {
        return "Modifier";
    }
}

/*
* Component affichant le formulaire pour ajouter/modifier une catégorie.
* On récupère en entrée les différentes informations nécessaires à l'affichage du component.
*/
export const CategoryForm = ({handleSubmit, buttonState, errors, type}) => {
    return (
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
                        <button type="submit" disabled={buttonState} className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">{typeForm(type)}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}