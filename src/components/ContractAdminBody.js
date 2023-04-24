import React, {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import useSWR from "swr";
import {useRouter} from "next/router";

const ContractAdminBody = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [cookies, setCookies, removeCookie] = useCookies(['user']);
    const router = useRouter()

    useEffect(()=>{
        if(!cookies['user'] || cookies?.user?.status !== 3){
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


    function formatMonth(indexMonth) {
        return (indexMonth < 10) ? '0' + indexMonth.toString() : indexMonth.toString();
    }

    function dateString(date){
        const dateFormat = new Date(date)
        return dateFormat.getFullYear()  + "-" + formatMonth(dateFormat.getMonth()+1)+ "-" + dateFormat.getDate();
    }

    const validateContract = async (idContract) => {
        setIsLoading(true);
        setError("");
        try{
            const sendData = {contractId: idContract}
            const response = await fetch('/api/user/validateContract',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            const result = await response.json();
            if(response.ok){
                console.log(result)
                //await router.reload();
            }else{
                setError(result.message);
            }
        }catch (err){
            console.error(err);
            setError("Une erreur est survenue. Réessayez plus tard s'il vous plait")
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setHasMounted(true);
    }, [])

    // Render
    if (!hasMounted) return null;

    return (
        <div className="py-3 px-4 sm:px-6 lg:px-8 flex flex-col items-center flex-1">
            <div className="">
                <h1 className="text-2xl font-semibold my-2">Contrats Admin</h1>
            </div>
            {contracts?.length === 0 &&
                <p className="my-10">Vous n'avez pas encore de contrat avec Fynal</p>
            }
            <section className="flex flex-col items-center">
                <div className="flex flex-col items-center my-4">
                    <h3>Contrats Vendeur</h3>
                    {contracts?.map((contract) => {
                        const sellerContract = contract.ContratVendeur;
                        if(contract.ContratVendeur?.comission){
                            return(
                                <div key={contract.idContrat} className="bg-gray-300 flex gap-4 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                                    <p className="text-gray-600 text-sm">Date de Début : {new Date(contract.dateDebut).toLocaleDateString("fr-Fr")}</p>
                                    <p className="text-gray-600 text-sm">Date de fin : {new Date(contract.dateFin).toLocaleDateString("fr-Fr")}</p>
                                    <p className="text-gray-600 text-sm">Etat du contrat : {contract.etat === 0 ? "En attente de validation" : contract.etat === 1 ? "En cours" : contract.etat === 2 ? "Fini" : ""}</p>
                                    <p className="text-gray-600 text-sm">Comission : {sellerContract?.comission} %</p>
                                    {contract.etat === 0 && <button onClick={() => validateContract(contract.idContrat)}>Approuver le contrat</button> }
                                </div>
                            )
                        }
                    })
                    }
                </div>

                <div className="flex flex-col items-center my-4">
                    <h3>Contrats Livreur</h3>
                    {contracts?.map((contract) => {
                        const delivererContract = contract.ContratLivreur
                        if(contract.ContratLivreur?.entrepriseAffiliee){
                            return(
                                <div key={contract.idContrat} className="bg-gray-300 flex gap-4 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                                    <p className="text-gray-600 text-sm">Date de Début : {new Date(contract.dateDebut).toLocaleDateString("fr-Fr")}</p>
                                    <p className="text-gray-600 text-sm">Date de fin : {new Date(contract.dateFin).toLocaleDateString("fr-Fr")}</p>
                                    <p className="text-gray-600 text-sm">Etat du contrat : {contract.etat === 0 ? "En attente de validation" : contract.etat === 1 ? "En cours" : contract.etat === 2 ? "Fini" : ""}</p>
                                    <p className="text-gray-600 text-sm">Entreprise affiliée : {delivererContract?.entrepriseAffiliee}</p>
                                </div>
                            )
                        }

                    })
                    }
                </div>

            </section>
        </div>
    );
};

export default ContractAdminBody;