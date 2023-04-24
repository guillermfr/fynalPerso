import NavSign from '../components/NavSign'
import SignInForm from "../components/SignInForm";

import { getCategorieIdData } from '../fonctions/SidebarData';
export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    return {
        props: {
            categoriesSideMenu,
        },
    };
}


export default function SignInPage(){
    return (
        <main className="flex flex-col items-center">
            <NavSign />
            <SignInForm />
        </main>
    )
}
