import Link from "next/link";
import {useRouter} from "next/router";

export default function NavSign(){
    const router = useRouter();
    const {pathname} = router;
    return (
        <nav className="w-full">
            <ul className="flex justify-evenly m-12">
                <li className={`${pathname === "/signin" ? "underline" : ""} text-xl`}><Link href="/signin">Connexion</Link></li>
                <li className={`${pathname === "/register" ? "underline" : ""} text-xl`}><Link href="/register">Inscription</Link></li>
            </ul>
        </nav>
    )
}