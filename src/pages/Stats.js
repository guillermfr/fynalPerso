import React from "react";
import { prisma } from "../../db";
import cookie from 'cookie';

const Stats = ({ vendeur }) => {
  return (
    <div className="py-3 px-4 flex flex-col gap-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold ">Statistiques de ventes</h1>
      </div>
      <div class="bg-emerald-100 text-xl font-semibold rounded-lg p-2 mt-4 max-w-max">
        <p class="whitespace-nowrap overflow-hidden overflow-ellipsis">
          Totalité de la période
        </p>
      </div>
      <div className="stats text-stone-950 bg-emerald-300 text-primary-content">
        <div className="stat">
          <div className="stat-title text-stone-800">Nombre de ventes</div>
          <div className="stat-value">{vendeur.nbrVentes}</div>
        </div>

        <div className="stat">
          <div className="stat-title text-stone-800">Bénéfices</div>
          <div className="stat-value">{vendeur.benefices} €</div>
        </div>
      </div>
    </div>
  );
};

// Fonction pour extraire les cookies d'une requête ou d'un document
function isAuth(req){
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export async function getServerSideProps({req}) {
    const Vendeur = prisma.Vendeur;
    const cookies = isAuth(req); // Extraction des cookies en utilisant la fonction isAuth
    const user = JSON.parse(cookies.user); // Conversion du cookie 'user' en objet JSON
    try {
    // On cherche l'utilisateur correspondant dans la BDD
    const vendeur = await Vendeur.findUnique({
      where: {
        idUtilisateur: user.idUtilisateur,
      },
    });

    // On retourne l'objet vendeur
    return {
        props: {
            vendeur,
        },
    };
    } catch (error) { // Capture d'une éventuelle erreur
        console.error(error);
        return {
            props: {
            vendeur: [],
        },
        };
    }
}

export default Stats;