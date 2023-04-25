import NavSign from '../components/NavSign'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage(){
    return (
        <main className="flex flex-col items-center">
            <NavSign />
            <RegisterForm />
        </main>
    )
}
