import React, {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import useSWR from "swr";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {contractSchema} from "../const";


const ContractBody = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [cookies, setCookies, removeCookie] = useCookies(['user']);
    const router = useRouter()

    useEffect(()=>{
        if(!cookies['user']){
            router.push('/')
        }
    }, [])

    // Requête fetch permettant de récupérer les informations de l'utilisateur et de les stocker dans le cookie
    const fetcher = url => fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: cookies?.user?.idUtilisateur, status: cookies?.user?.status})
    })
        .then((res) => res.json())
        //.then((data) => console.log(data))

    // Envoie de la requête à chaque chargement de la page à l'aide d'SWR
    const {data: contracts, error:errorSWR, isLoading: isLoadingSWR} = useSWR(cookies['user'] ? '/api/user/getContracts' : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const [contractDemand, setContractDemand] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isDisabledSeller, setIsDisabledSeller] = useState(false);
    const [isDisabledDeliverer, setIsDisabledDeliverer] = useState(false)
    const [defaultTypeContract, setDefaultTypeContract] = useState("");

    const {register: registerContract, handleSubmit: handleSubmitContract, watch, formState: {errors: errorsContract}, reset: resetContract} = useForm({
        resolver: yupResolver(contractSchema),
        mode: "onChange",
        defaultValues:{
            startDate: new Date(),
        }
    });

    const watchContractType = watch('contractType');

    const handleCancelContract = () => {
        resetContract();
        setContractDemand(false);
    }

    const handleContractDemand = () => {
        setContractDemand(true);
        setTypeContract();
    }

    function formatMonth(indexMonth) {
        return (indexMonth < 10) ? '0' + indexMonth.toString() : indexMonth.toString();
    }

    function dateString(date){
        const dateFormat = new Date(date)
        return dateFormat.getFullYear()  + "-" + formatMonth(dateFormat.getMonth()+1)+ "-" + dateFormat.getDate();
    }

    const onSubmitContract = async (data) => {
        setIsLoading(true);
        setError("");
        try{
            const userIdObj = {userId: cookies?.user?.idUtilisateur}
            const startDateObj = {startDate: new Date(dateString(data.startDate))};
            const endDateObj = {endDate: new Date(dateString(data.endDate))};
            const sendData = {...userIdObj, ...data, ...startDateObj, ...endDateObj}
            console.log(sendData)
            const response = await fetch('/api/user/setContractDemand',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            if(response.ok){
                console.log(result)
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

    const terminateContract = async () => {
        setIsLoading(true);
        setError("");
        try{
            const sendData = {userId: cookies?.user?.idUtilisateur}
            const response = await fetch('/api/user/terminateContract',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            if(response.ok){
                console.log(result)
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

    const setTypeContract = () =>{
        setIsDisabledSeller(contracts.length !== 0 && (contracts[0].ContratVendeur === null || contracts[0].etat !== 2));
        setIsDisabledDeliverer(contracts.length !== 0 && (contracts[0].ContratLivreur === null || contracts[0].etat !== 2));
        // isDisabledSeller && isDisabledDeliverer ? "" : isDisabledSeller ? "Deliverer" : isDisabledDeliverer ? "Seller" : ""
    }

    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;

    return (
        <div className="py-3 px-4 sm:px-6 lg:px-8 flex flex-col items-center flex-1">
            <div className="">
                <h1 className="text-2xl font-semibold my-2">Contrats {cookies?.user?.status === 1 ? "vendeur" : cookies?.user?.status === 2 ? "livreur" : ""}</h1>
            </div>
            {contracts?.length === 0 &&
                <p className="my-10">Vous n'avez pas encore de contrat avec Fynal</p>
            }
            <section className="w-full shadow mr-1 p-2">
                <form onSubmit={handleSubmitContract(onSubmitContract)} className="w-full flex flex-col items-center">
                    {!contractDemand &&
                        <div>
                            <button onClick={()=> handleContractDemand() } className="mr-2 px-2 py-1 button-profile-form mb-1">Faire une demande contrat</button>
                            <button onClick={() => terminateContract()} className="ml-2 px-2 py-1 button-profile-form mb-1">Résilier le contrat en cours</button>
                        </div>
                    }
                    {contractDemand &&
                        <>
                            <div>
                                <input type="submit" value="Enregistrer" className="mr-2 px-2 py-1 button-profile-form"/>
                                <button onClick={()=> handleCancelContract()} className="mx-2 px-2 py-1 button-profile-form">Annuler</button>
                                <button onClick={() => terminateContract()} className="ml-2 px-2 py-1 button-profile-form mb-1">Résilier le contrat en cours</button>
                            </div>
                            {contracts[0]?.etat === 0 &&
                                <p>
                                    Vous avez déjà un contrat en attente de validation
                                </p>
                            }
                            <table className="w-2/3 m-2">
                                <tbody>
                                <tr className="w-full">
                                    <td className="w-1/2"><label htmlFor="actualPassword">Type de contrat</label></td>
                                    <td className="w-1/2">
                                        <select {...registerContract("contractType")} id="contractType" defaultValue={""} name="contractType" className={`peer h-10 ${errorsContract.contractType ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required >
                                            <option value="" disabled>-----Choisi une option-----</option>
                                            <option value="Seller" disabled={isDisabledSeller}>Vendeur</option>
                                            <option value="Deliverer" disabled={isDisabledDeliverer}>Livreur</option>
                                        </select>
                                        <p className="error-form">
                                            {errorsContract.contractType && errorsContract.contractType.message}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="startDate">Date de début du contrat</label></td>
                                    <td>
                                        <input {...registerContract("startDate")} type="date" id="startDate" className={`peer ${errorsContract.startDate ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                        <p className="error-form">
                                            {errorsContract.startDate && errorsContract.startDate.message}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="endDate">Date de fin du contrat</label></td>
                                    <td>
                                        <input {...registerContract("endDate")} type="date" id="endDate" className={`peer ${errorsContract.endDate ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                        <p className="error-form">
                                            {errorsContract.endDate && errorsContract.endDate.message}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="company">Entreprise</label></td>
                                    <td>
                                        <input {...registerContract("company")} type="text" id="company" className={`peer ${errorsContract.company ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                        <p className="error-form">
                                            {errorsContract.company && <span>{errorsContract.company.message}</span>}
                                        </p>
                                    </td>
                                </tr>
                                {watchContractType === "Seller" &&
                                    <tr>
                                        <td><label htmlFor="commission">Commission</label></td>
                                        <td>
                                            <input {...registerContract("commission")} type="number" id="commission" min="0" max="100" className={`peer ${errorsContract.commission ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                            <p className="error-form">
                                                {errorsContract.commission && <span>{errorsContract.commission.message}</span>}
                                            </p>
                                        </td>
                                    </tr>
                                }
                                {watchContractType === "Deliverer" &&
                                    <>
                                        <tr>
                                            <td><label htmlFor="license">Commission</label></td>
                                            <td>
                                                <input {...registerContract("license")} type="text" id="license" className={`peer ${errorsContract.license ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                                <p className="error-form">
                                                    {errorsContract.license && <span>{errorsContract.license.message}</span>}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="vehicle">Commission</label></td>
                                            <td>
                                                <input {...registerContract("vehicle")} type="text" id="vehicle" className={`peer ${errorsContract.vehicle ? "form-auth-input-invalid invalid" : "form-auth-input-valid valid"}`} required/>
                                                <p className="error-form">
                                                    {errorsContract.vehicle && <span>{errorsContract.vehicle.message}</span>}
                                                </p>
                                            </td>
                                        </tr>
                                    </>
                                }
                                </tbody>
                            </table>
                        </>
                    }
                </form>
            </section>
            <section>
                {contracts?.map((contract) => {
                    const sellerContract = contract.ContratVendeur;
                    const delivererContract = contract.ContratLivreur
                    return(
                        <div key={contract.idContrat} className="bg-gray-300 flex gap-4 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                            <p className="text-gray-600 text-sm">Date de Début : {new Date(contract.dateDebut).toLocaleDateString("fr-Fr")}</p>
                            <p className="text-gray-600 text-sm">Date de fin : {new Date(contract.dateFin).toLocaleDateString("fr-Fr")}</p>
                            <p className="text-gray-600 text-sm">Etat du contrat : {contract.etat === 0 ? "En attente de validation" : contract.etat === 1 ? "En cours" : contract.etat === 2 ? "Fini" : ""}</p>
                            {contract.ContratVendeur?.comission && <p className="text-gray-600 text-sm">Comission : {sellerContract?.comission} %</p>}
                            {contract.ContratLivreur?.entrepriseAffiliee && <p className="text-gray-600 text-sm">Entreprise affiliée : {delivererContract?.entrepriseAffiliee}</p>}
                        </div>
                    )
                })
                }
            </section>
        </div>
    );
};

export default ContractBody;