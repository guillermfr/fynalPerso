import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useRouter} from "next/router";
import {useState} from "react";
import {signInSchema} from "../const";
import {useCookies} from "react-cookie";


const SignInForm = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Utilisation du hook useForm pour gérer le formulaire de connexion des utilisateurs plus facilement
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(signInSchema),
        mode: "onChange"
    });

    // Fonction executé lorsque le formulaire de connexion est validé
    const onSubmit = async (data) =>{
        setIsLoading(true);
        setError("");
        try{
            const response = await fetch('/api/auth/signin',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if(response.ok){
                console.log(result)
                // enregistrement de id utilisateur dans un cookie servant de session
                setCookie('user', result, {
                    path: '/',
                    MaxAge: 60 * 60 * 24 * 15,
                })
                await router.replace("/");
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);

    }

    if(cookies['user']){
        router.push('/')
    }

    return (
        <div>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="email">Adresse e-mail</label>
                    <input {...register("email")} type="email" id="email" className={`peer ${errors.email ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                    <p className="error-form">
                        {errors.email && errors.email.message}
                    </p>
                </div>
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="password">Mot de passe</label>
                    <input {...register("password")} type="password" id="password" className={`peer ${errors.password ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                    <p className="error-form">
                        {errors.password && errors.password.message}
                    </p>
                </div>
                <input type="submit" value="Connexion" className="w-32 mt-3 border border-solid rounded-xl hover:bg-blue-300" />
            </form>
        </div>
    )
}

export default SignInForm
