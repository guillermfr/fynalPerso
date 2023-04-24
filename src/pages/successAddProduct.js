import { getCategorieIdData } from "../fonctions/SidebarData";

export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    
    return {
        props: {
            categoriesSideMenu: categoriesSideMenu,
        },
    };
}

export default function SuccessAddProduct() {
    return (
        <div className="text-4xl font-extrabold dark:text-white m-10">Le produit a bien été ajouté.</div>
    );
}