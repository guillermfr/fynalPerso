import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {addressSchema, passwordProfileSchema, profileSchema} from "../const";
import {useCookies} from "react-cookie";
import {useRouter} from "next/router";

const AccountBody = () => {

    const [hasMounted, setHasMounted] = useState(false);
    const [cookies, setCookies] = useCookies(['user']);
    const router = useRouter();

    // Permet de revenir à l'accueil si l'on est pas connecté
    useEffect(()=>{
        if(!cookies['user']){
            router.push('/')
        }
    }, [])

    // Fonction permettant d'obtenir un index de mois commençant par un 0
    function formatMonth(indexMonth) {
        return (indexMonth < 10) ? '0' + indexMonth.toString() : indexMonth.toString();
    }

    const [changeOnProfile, setChangeOnProfile] = useState(false);
    const [changeOnPassword, setChangeOnPassword] = useState(false);
    const [changeOnAddress, setChangeOnAddress] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    // Fonction permettant de convertir une date en String
    function birthDateString(date){
        const dateFormat = new Date(date)
        return dateFormat.getFullYear()  + "-" + formatMonth(dateFormat.getMonth()+1)+ "-" + dateFormat.getDate();
    }

    const birthDateDisplay = birthDateString(cookies?.user?.dateNaissance)

    // Utilisation du hook useForm pour gérer le formulaire de la modification de profile plus facilement
    const {register: registerProfile, handleSubmit: handleSubmitProfile, formState: {errors: errorsProfile}, reset: resetProfile} = useForm({
        resolver: yupResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            firstName:cookies?.user?.prenom,
            lastName:cookies?.user?.nom,
            email:cookies?.user?.email,
            birthDate:birthDateDisplay,
            sex:cookies?.user?.genre,
        }
    });

    // Utilisation du hook useForm pour gérer le formulaire de la modification de l'adresse plus facilement
    const {register: registerAddress, handleSubmit: handleSubmitAddress, formState: {errors: errorsAddress}, reset: resetAddress} = useForm({
        resolver: yupResolver(addressSchema),
        mode: "onChange",
        defaultValues: {
            addressBody:cookies?.user?.adresse?.numeroNomRue,
            addressAddition: cookies?.user?.adresse?.complement,
            postcode:cookies?.user?.adresse?.codePostal,
            city:cookies?.user?.adresse?.ville,
            country:cookies?.user?.adresse?.pays,

        }
    });

    // Utilisation du hook useForm pour gérer le formulaire de la modification de mot de passe plus facilement
    const {register: registerPassword, handleSubmit: handleSubmitPassword, formState: {errors: errorsPassword}, reset: resetPassword} = useForm({
        resolver: yupResolver(passwordProfileSchema),
        mode: "onChange",
    });

    // Permet d'annuler la modification de profile en cours
    const handleCancelProfile = () => {
        resetProfile();
        setChangeOnProfile(false);
    }

    // Permet d'annuler la modification de l'adresse en cours
    const handleCancelAddress = () => {
        resetAddress();
        setChangeOnAddress(false);
    }

    // Permet d'annuler la modification de mot de passe en cours
    const handleCancelPassword = () => {
        resetPassword();
        setChangeOnPassword(false);
    }

    // Fonction executé lorsque le formulaire de modification du profile est validé
    const onSubmitProfile = async (data) => {
        setIsLoading(true);
        setError("");
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const birthDateObj = {birthDate: new Date(birthDateString(data.birthDate))};
            const sendData = {...userIdObj, ...data, ...birthDateObj}
            const response = await fetch('/api/user/updateProfile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            if(response.ok){
                await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    // Fonction executé lorsque le formulaire de modification de l'adresse est validé
    const onSubmitAddress = async (data) => {
        setIsLoading(true);
        setError("");
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const sendData = {...userIdObj, ...data}
            const response = await fetch('/api/user/updateAddress',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            if(response.ok){
                await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    // Fonction executé lorsque le formulaire de modification du mot de passe est validé
    const onSubmitPassword = async (data) => {
        setIsLoading(true);
        setError("");
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const sendData = {...userIdObj, ...data}
            const response = await fetch('/api/user/updatePassword',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            if(response.ok){
                await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    // hook permettant d'éviter les erreurs d'hydratation
    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;

    return (
        <div className="flex flex-col items-center flex-1 mx-5">
            <h2 className="mt-2 text-2xl font-semibold">Espace utilisateur</h2>
            <section className="flex flex-col items-center flex-1 w-full shadow mr-1 my-2 p-2">
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="w-full flex flex-col items-center">
                    <div className="w-full flex justify-between">
                        <div className="w-3/5 flex justify-center">
                            <h3 className="ml-5 text-xl font-medium underline">Profil</h3>
                        </div>
                        <div className="w-2/5 flex justify-end">
                            {changeOnProfile &&
                                <>
                                    <input type="submit" value="Enregistrer" className="mr-2 my-1 px-2 py-1 button-profile-form"/>
                                    <button onClick={()=> handleCancelProfile()} className="ml-2 mr-5 my-1 px-2 py-1 button-profile-form">Annuler</button>
                                </>
                            }
                            {!changeOnProfile &&
                                <button onClick={()=> setChangeOnProfile(true)} className="mx-5 my-1 px-2 py-1 button-profile-form">Modifier</button>
                            }
                        </div>
                    </div>
                    <table className="w-2/3 m-2">
                        <tbody>
                            <tr className="w-full">
                                <td className="w-1/2"><label htmlFor="firstName" className="">Prénom</label></td>
                                <td className="w-1/2">
                                    <input {...registerProfile("firstName")} type="text" id="firstName" className={`peer ${!changeOnProfile ? "form-profile-input-display" : errorsProfile.firstName ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.firstName && <span>{errorsProfile.firstName.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="lastName">Nom</label></td>
                                <td>
                                    <input {...registerProfile("lastName")} type="text" id="lastName" className={`peer ${!changeOnProfile ? "form-profile-input-display" : errorsProfile.lastName ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`}  required disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.lastName && <span>{errorsProfile.lastName.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="email">Adresse e-mail</label></td>
                                <td>
                                    <input {...registerProfile("email")} type="email" id="email" className={`peer ${!changeOnProfile ? "form-profile-input-display" : errorsProfile.email ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.email && <span>{errorsProfile.email.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="birthDate">Date de naissance</label></td>
                                <td>
                                    <input {...registerProfile("birthDate")} type="date" id="birthDate" className={`peer ${!changeOnProfile ? "form-profile-input-display" : errorsProfile.birthDate ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} disabled={!changeOnProfile}/>
                                    <p className="error-form">
                                        {errorsProfile.birthDate && <span>{errorsProfile.birthDate.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><p>Genre</p></td>
                                <td>
                                    {changeOnProfile &&
                                        <>
                                            <label className="mr-1">
                                                <input {...registerProfile("sex")} type="radio" name="sex" id="radio-man" value="Homme" defaultChecked={cookies?.user?.genre === "Homme"} className={`peer h-4 ${errorsProfile.sex ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} />
                                                Homme
                                            </label>
                                            <label className="mr-1">
                                                <input {...registerProfile("sex")} type="radio" name="sex" id="radioWoman" value="Femme" defaultChecked={cookies?.user?.genre === "Femme"} className={`peer h-4 ${errorsProfile.sex ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} />
                                                Femme
                                            </label>
                                            <label className="">
                                                <input {...registerProfile("sex")} type="radio" name="sex" id="radioOther" value="Autre" defaultChecked={cookies?.user?.genre === "Autre"} className={`peer h-4 ${errorsProfile.sex ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} />
                                                Autre
                                            </label>
                                            <p className="error-form">
                                                {errorsProfile.sex && <span>{errorsProfile.sex.message}</span>}
                                            </p>
                                        </>
                                    }
                                    {!changeOnProfile &&
                                        <p className="pl-3">{cookies?.user?.genre}</p>
                                    }
                                </td>
                            </tr>
                        </tbody>

                    </table>


                </form>
            </section>
            <section className="w-full shadow mr-1 p-2">
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="w-full flex flex-col items-center">
                    {!changeOnPassword &&
                        <div>
                            <button onClick={()=> setChangeOnPassword(true)} className="px-2 py-1 button-profile-form mb-1">Changer le mot de passe</button>
                        </div>
                    }
                    {changeOnPassword &&
                        <>
                            <div>
                                <input type="submit" value="Enregistrer" className="mr-2 px-2 py-1 button-profile-form"/>
                                <button onClick={()=> handleCancelPassword()} className="ml-2 px-2 py-1 button-profile-form">Annuler</button>
                            </div>
                            <table className="w-2/3 m-2">
                                <tbody>
                                    <tr className="w-full">
                                        <td className="w-1/2"><label htmlFor="actualPassword">Mot de passe</label></td>
                                        <td className="w-1/2">
                                            <input {...registerPassword("actualPassword")} type="password" id="actualPassword" className={`peer ${errorsPassword.actualPassword ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                            <p className="error-form">
                                                {errorsPassword.actualPassword && errorsPassword.actualPassword.message}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor="password">Nouveau mot de passe</label></td>
                                        <td>
                                            <input {...registerPassword("password")} type="password" id="password" className={`peer ${errorsPassword.password ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                            <p className="error-form">
                                                {errorsPassword.password && errorsPassword.password.message}
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label htmlFor="confirmPassword">Confirmation du nouveau mot de passe</label></td>
                                        <td>
                                            <input {...registerPassword("confirmPassword")} type="password" id="confirmPassword" className={`peer ${errorsPassword.confirmPassword ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                            <p className="error-form">
                                                {errorsPassword.confirmPassword && <span>{errorsPassword.confirmPassword.message}</span>}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    }
                </form>
            </section>
            <section className="flex flex-col items-center flex-1 w-full shadow mr-1 my-2 p-2 mb-20">
                <form onSubmit={handleSubmitAddress(onSubmitAddress)} className="w-full flex flex-col items-center">
                    <div className="w-full flex justify-between">
                        <div className="w-3/5 flex justify-center">
                            <h3 className="ml-5 text-xl font-medium underline">Adresse</h3>
                        </div>
                        <div className="w-2/5 flex justify-end">
                            {changeOnAddress &&
                                <>
                                    <input type="submit" value="Enregistrer" className="mr-2 my-1 px-2 py-1 button-profile-form"/>
                                    <button onClick={()=> handleCancelAddress()} className="ml-2 mr-5 my-1 px-2 py-1 button-profile-form">Annuler</button>
                                </>
                            }
                            {!changeOnAddress &&
                                <button onClick={()=> setChangeOnAddress(true)} className="mx-5 my-1 px-2 py-1 button-profile-form">Modifier</button>
                            }
                        </div>
                    </div>
                    <table className="w-2/3 m-2">
                        <tbody>
                            <tr className="w-full">
                                <td className="w-1/2"><label htmlFor="addressBody" className="">Corps de l'adresse</label></td>
                                <td className="w-1/2">
                                <textarea {...registerAddress("addressBody")} type="textarea" rows="2" cols="30" id="addressBody" className={`peer ${!changeOnAddress ? "border-0 resize-none" : errorsAddress.addressBody ? "form-auth-input-invalid invalid h-auto" : "form-auth-input-valid valid h-auto"}`} required disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.addressBody && <span>{errorsAddress.addressBody.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="addressAddition">Complément</label></td>
                                <td>
                                    <input {...registerAddress("addressAddition")} type="text" id="addressAddition" className={`peer ${!changeOnAddress ? "form-profile-input-display" : errorsAddress.addressAddition ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`}  required disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.addressAddition && <span>{errorsAddress.addressAddition.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="postcode">Code postal</label></td>
                                <td>
                                    <input {...registerAddress("postcode")} type="number" id="postcode" className={`peer ${!changeOnAddress ? "form-profile-input-display" : errorsAddress.postcode ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.postcode && <span>{errorsAddress.postcode.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="city">Ville</label></td>
                                <td>
                                    <input {...registerAddress("city")} type="text" id="city" className={`peer ${!changeOnAddress ? "form-profile-input-display" : errorsAddress.city ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.city && <span>{errorsAddress.city.message}</span>}
                                    </p>
                                </td>
                            </tr>
                            <tr className="">
                                <td><label htmlFor="country">Pays</label></td>
                                <td>
                                    <input {...registerAddress("country")} type="text" id="country" className={`peer ${!changeOnAddress ? "form-profile-input-display" : errorsAddress.country ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} disabled={!changeOnAddress}/>
                                    <p className="error-form">
                                        {errorsAddress.country && <span>{errorsAddress.country.message}</span>}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </section>
        </div>
    )
}

export default AccountBody;
