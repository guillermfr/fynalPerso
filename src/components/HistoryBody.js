import React, {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import useSWR from "swr";
import {useRouter} from "next/router";


const HistoryBody = () => {
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
        body: JSON.stringify({userId: cookies?.user?.idUtilisateur})
    })
        .then((res) => res.json())
        //.then((data) => console.log(data))

    // Envoie de la requête à chaque chargement de la page à l'aide d'SWR
    const {data: commandes, error:errorSWR, isLoading: isLoadingSWR} = useSWR(cookies['user'] ? '/api/user/getOrderHistory' : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    let keyProduct= 0;

    return (
        <div className="py-3 px-4 sm:px-6 lg:px-8 flex flex-col items-center flex-1">
            <div className="">
                <h1 className="text-2xl font-semibold my-2">Historique des commandes</h1>
            </div>
            {commandes?.length === 0 &&
                <p className="my-10">Vous n'avez pas encore fait de commande</p>
            }
            {commandes?.map((commande) => {
                return(
                    <div key={commande.idCommande}>
                        <div className="bg-gray-300 flex gap-4 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                            <p className="text-gray-600 text-sm">Date de commande : {commande.dateCommande}</p>
                            <p className="text-gray-600 text-sm">ID de commande : {commande.idCommande}</p>
                            <p className="text-gray-600 text-sm">Etat de la commande : {commande.etatCommande}</p>
                            <p className="text-gray-600 text-sm">Total : {commande.PanierProduit.map(item => item.Produit.prix * item.quantite).reduce((acc, val) => acc + val, 0)} €</p>
                        </div>
                        <div className="bg-gray-200 rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="border-b">
                                    <th className="px-4 py-2 text-gray-600 text-left">Produit</th>
                                    <th className="px-4 py-2 text-gray-600 text-left">Quantité</th>
                                    <th className="px-4 py-2 text-gray-600 text-left">Prix unitaire</th>
                                    <th className="px-4 py-2 text-gray-600 text-left">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {commande.PanierProduit.map((Data) => {
                                    keyProduct += 1;
                                    return(
                                        <tr className="border-b pb-4" key={keyProduct}>
                                            <td className="px-4 py-2">
                                                <img
                                                    src={Data.Produit.image}
                                                    alt={Data.Produit.nom}
                                                    className="ml-4 h-20 w-20 object-contain rounded-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">{Data.quantite}</td>
                                            <td className="px-4 py-2 text-gray-600">{Data.Produit.prix} €</td>
                                            <td className="px-4 py-2 text-gray-600">{Data.Produit.prix * Data.quantite} €</td>
                                        </tr>

                                    )
                                })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HistoryBody;