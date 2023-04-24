import React from "react";
import { useCookies } from "react-cookie";
import { prisma } from "../../db";
import { useState } from "react";
import dynamic from "next/dynamic";

const Delivery = ({commandes}) => {
  const [cookies] = useCookies(['user']);
  const [adresses, setAdresses] = useState([]);
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const DeliveryMap = dynamic(() => import('../fonctions/DeliveryMap'), { ssr: false });

  const getCP = (codePostal) => {
    return String(codePostal).substring(0,2);
  };

  const getAdress = (adresse) => {
    return `${adresse?.numeroNomRue} ${adresse?.ville}, ${adresse?.codePostal}`;
  };

  const handleOptimizeClick = () => {
    setShowDeliveryMap(true);
  };
  
  React.useEffect(() => {
    const newAdresses = [];
    newAdresses.push(getAdress(cookies.user.adresse));
    commandes.forEach((commande) => {
      if (
        getCP(cookies?.user?.adresse?.codePostal) ===
          getCP(commande.Adresse.codePostal) &&
        newAdresses.length < 20
      ) {
        newAdresses.push(getAdress(commande.Adresse));
      }
    });
    setAdresses(newAdresses);
  }, [commandes, cookies.user]);


  const handleOptimiserTrajet = () => {
    return(
      <div>
          {showDeliveryMap && <div className="border-4 border-black border-solid "><DeliveryMap addresses={adresses} /> </div>}
      </div>
    )
  };

  const handleCommandeLivree = async () => {
    try {
      await fetch("/api/changeCommandeState", {
        method: "POST",
        body: JSON.stringify({ commandes: commandes.map((commande) => commande.idCommande) }),
      });
  
      setAdresses([]);
    } catch (error) {
      console.error(error);
    }
  };

  return( 
    <div className="py-3 px-4 flex flex-col gap-2 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold ">Livraisons disponibles</h1>
        </div>
        <div className="bg-gray-200 flex gap-4 justify-between rounded-lg p-4 mt-4 mx-4 md:mx-10 lg:mx-20 xl:mx-32">
          <p className="text-gray-600 text-xl font-semibold">Nombre de commandes à livrer : {adresses.length - 1}</p>
          {adresses.length > 1 ? (
            <div className="flex gap-6">
              <button className="btn btn-primary btn-sm" onClick={handleOptimizeClick}>Optimiser trajet</button>
              <button className="btn btn-success btn-sm " onClick={handleCommandeLivree}>Commande livrée</button>
            </div>
          ) : (
            <div className="text-xl font-semibold">
              Aucune commande disponible
            </div>
          )}
          
        </div>
        {handleOptimiserTrajet()}
    </div>
  )
};


export async function getServerSideProps() {
  const Commande = prisma.Commande;
  
  try {
    const commandes = await Commande.findMany({
      where: {
        etatCommande : 0,
      },
        include: {
          Adresse: true,
        }
    });

    return {
      props: {
        commandes,
      },
    };
    }catch (error) {
    console.error(error);
    return {
      props: {
        commandes: [],
      },
    };
  }
}


export default Delivery;
