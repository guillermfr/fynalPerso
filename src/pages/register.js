import NavSign from '../components/NavSign'
import RegisterForm from '../components/RegisterForm'

import { getCategorieIdData } from '../fonctions/SidebarData';
export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();
    return {
        props: {
            categoriesSideMenu,
        },
    };
}

export default function RegisterPage(){
    return (
        <main className="flex flex-col items-center">
            <NavSign />
            <RegisterForm />
        </main>
    )
}