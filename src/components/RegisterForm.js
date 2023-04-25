import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {registerSchema} from "../const";
import {useState} from "react";
import {useRouter} from "next/router";

const RegisterForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Utilisation du hook useForm pour gérer le formulaire d'enregistrement d'utilisateur plus facilement
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onChange"
    });

    // Fonction executé lorsque le formulaire d'enregistrement est validé
    const onSubmit = async (data) => {
        setIsLoading(true);
        setError("");
        try{
            const response = await fetch('/api/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if(response.ok){
                await router.push("/signin");
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center ">
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}  className="flex flex-col items-center ">
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="firstName">Prénom *</label>
                    <input {...register("firstName")} type="text" id="firstName" className={`peer ${errors.firstName ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                    <p className="error-form">
                        {errors.firstName && <span>{errors.firstName.message}</span>}
                    </p>
                </div>
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="lastName">Nom *</label>
                    <input {...register("lastName")} type="text" id="lastName" className={`peer ${errors.lastName ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`}  required/>
                    <p className="error-form">
                        {errors.lastName && <span>{errors.lastName.message}</span>}
                    </p>
                </div>
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="email">Adresse e-mail *</label>
                    <input {...register("email")} type="email" id="email" className={`peer ${errors.email ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                    <p className="error-form">
                        {errors.email && <span>{errors.email.message}</span>}
                    </p>
                </div>
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="password">Mot de passe *</label>
                    <input {...register("password")} type="password" id="password" className={`peer ${errors.password ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                    <p className="error-form">
                        {errors.password && <span>{errors.password.message}</span>}
                    </p>
                </div>
                <div className="flex flex-col w-60 m-1">
                    <label htmlFor="confirmPassword">Confirmation du mot de passe *</label>
                    <input {...register("confirmPassword")} type="password" id="confirmPassword" className={`peer ${errors.confirmPassword ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                    <p className="error-form">
                        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                    </p>
                </div>
                <input type="submit" value="Inscription" className="w-32 mt-3 border border-solid rounded-xl"/>
            </form>
        </div>

    )
}

export default RegisterForm;