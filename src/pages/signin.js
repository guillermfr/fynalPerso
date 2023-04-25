import NavSign from '../components/NavSign'
import SignInForm from "../components/SignInForm";

export default function SignInPage(){
    return (
        <main className="flex flex-col items-center">
            <NavSign />
            <SignInForm />
        </main>
    )
}
