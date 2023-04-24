import { getCategorieIdData } from "../fonctions/SidebarData";

export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    
    return {
        props: {
            categoriesSideMenu: categoriesSideMenu,
        },
    };
}

export default function SuccessAddCategory() {
    return (
        <div className="text-4xl font-extrabold dark:text-white m-10">La catégorie a bien été ajoutée.</div>
    );
}