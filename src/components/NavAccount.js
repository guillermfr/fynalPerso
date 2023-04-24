import Link from "next/link";
import {useRouter} from "next/router";
import {useCookies} from "react-cookie";

export default function NavAccount(){
    const [cookies] = useCookies(['user'])
    const router = useRouter();
    const {pathname} = router;
    if(cookies?.user?.status !== 3){
        return (
            <nav className="">
                <ul className="flex flex-col m-3">
                    <li className={`${pathname === "/account" ? "underline" : ""} text-xl`}><Link href="/account">Espace utilisateur</Link></li>
                    <li className={`${pathname === "/history" ? "underline" : ""} text-xl`}><Link href="/history">Historique</Link></li>
                    <li className={`${pathname === "/contract" ? "underline" : ""} text-xl`}><Link href="/contract">Contrats</Link></li>
                </ul>
            </nav>
        )
    }
}