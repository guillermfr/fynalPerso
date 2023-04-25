import NavAccount from '../components/NavAccount'
import RegisterForm from '../components/RegisterForm'
import AccountBody from "../components/AccountBody";

export default function AccountPage(){
    return (
        <main className="flex flex-row flex-1">
            <NavAccount />
            <AccountBody />
        </main>
    )
}
