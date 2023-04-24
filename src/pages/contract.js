import NavAccount from "../components/NavAccount";
import ContractBody from "../components/ContractBody";
import {useCookies} from "react-cookie";
import ContractAdminBody from "../components/ContractAdminBody";
import {useEffect, useState} from "react";
import { getCategorieIdData } from "../fonctions/SidebarData";

export async function getStaticProps() {
    const categoriesSideMenu = await getCategorieIdData();

    return {
        props: {
            categoriesSideMenu: categoriesSideMenu,
        }
    }
}

const Contract = () => {
    return (
        <main className="flex flex-1">
            <NavAccount />
            <ContractBody/>
        </main>
    );
};

export default Contract;
