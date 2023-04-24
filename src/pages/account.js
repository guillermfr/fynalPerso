import NavAccount from '../components/NavAccount'
import RegisterForm from '../components/RegisterForm'
import AccountBody from "../components/AccountBody";

import { getCategorieIdData } from '../fonctions/SidebarData';
export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    return {
        props: {
            categoriesSideMenu,
        },
    };
}

export default function AccountPage(){
    return (
        <main className="flex flex-row flex-1">
            <NavAccount />
            <AccountBody />
        </main>
    )
}