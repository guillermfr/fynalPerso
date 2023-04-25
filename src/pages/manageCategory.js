import { prisma } from "../../db";
import Router from "next/router";

export async function getServerSideProps(context) {
    const categories = await prisma.categorie.findMany();

    return {
        props: {
            categories : categories,
        }
    }
}

const handleDelete = async (event, idCategorie) => {
    const data = {
        idCategorie: idCategorie,
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = '/api/delete/deleteCategory';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSONdata
    };

    const response = await fetch(endpoint, options);
    
    Router.reload('/manageCategory');
}
  
export default function ModifCategoryHome({ categories }) {
    return (
        <div className="flex flex-col gap-2 mt-5">
            <div className="flex">
                <div className="md:w-3/5"></div>
                <a href="/addCategory" className="md:w-1/5 text-normal px-3 py-2 text-white text-center  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none">Ajouter une catégorie</a>
                <div className="md:w-1/5"></div>
            </div>
            { categories.map((categorie) => {
                return (
                    <div key={categorie.idCategorie} className="flex rounded-lg">
                        <div className="md:w-1/5 invisible"></div>
                        <div className="flex md:w-3/5 border-5 bg-slate-200 rounded-lg">
                            <div className="align-middle md:w-1/5">{categorie.libelle}</div>
                            <div className="md:w-1/5 invisible"></div>
                            <div className="md:w-1/5 invisible"></div>
                            <a href={["/modifCategory/", categorie.idCategorie].join('')} className="md:w-1/5 text-normal px-3 py-2 ml-auto text-white text-center  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none">Modifier</a>
                            <button onClick={(e) => handleDelete(e, categorie.idCategorie)} className="md:w-1/5 text-normal px-3 py-2 ml-auto text-white text-center  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none">Supprimer</button>
                        </div>
                        <div className="md:w-1/5 invisible"></div>
                    </div>
                )
            }) }
        </div>
    )
}
