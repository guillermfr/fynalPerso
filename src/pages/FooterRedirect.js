import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getCategorieIdData } from "../fonctions/SidebarData";


// Fonction pour récupérer les catégories dans la sidebar
export async function getStaticProps() {
  const categoriesSideMenu = await getCategorieIdData();
  return {
    props: {
      categoriesSideMenu,
    },
  };
}

export default function FooterRedirect(){
    // On récupère l'id de la page à afficher
    const router = useRouter();
    const q = router.query.q;

    const [showPopup, setShowPopup] = useState(false);

    const formRef = useRef(null);

    useEffect(() => {
      if (showPopup) {
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      }
    }, [showPopup]);

    // Popup de validation du formulaire
    const handleClick = (event) => {
        event.preventDefault();
        setShowPopup(true);
        formRef.current.reset();
    };

    switch(q){
        case 'about':
            return(
                <div className="container justify-start mx-auto my-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-5">Bienvenue sur fynal</h1>
                    <p className="mb-5">
                    Chez fynal, nous sommes une plateforme en ligne qui permet aux clients d'acheter une variété de produits auprès de différents vendeurs.<br></br>
                    Nous offrons une expérience de shopping unique en rassemblant des produits de qualité auprès de vendeurs de confiance.
                    </p>
                    <p className="mb-5">
                    Nous sommes également fiers de notre système d'optimisation de livraison qui garantit une livraison rapide et fiable.<br></br>
                    Nous travaillons avec les meilleurs transporteurs pour nous assurer que vos commandes arrivent à temps et en parfait état.
                    </p>
                    <p className="mb-5">
                    Chez fynal, nous croyons en la qualité des produits et nous voulons que nos clients soient entièrement satisfaits.<br></br>
                    C'est pourquoi nous offrons une politique de retour gratuite pour tous nos produits.<br></br>
                    Si pour une raison quelconque vous n'êtes pas satisfait de votre achat, nous sommes là pour vous aider à trouver une solution.
                    </p>
                    <p>
                    Nous sommes heureux de vous offrir une expérience de shopping en ligne facile et sécurisée.<br></br>
                    N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.
                    </p>
              </div>
            );
        case 'contact' :
            return(
                <div>
                    <div className="font-sans text-base text-gray-900 sm:px-10">
                        <div className="text-base text-gray-900">
                            <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                            <div className="mx-2 pt-5 text-center md:mx-auto md:w-2/3 md:pb-12">
                                <h1 className="text-3xl font-black sm:text-5xl xl:text-6xl">Contactez nous</h1>
                            </div>
                            </div>
                        </div>
                        <div className="mx-auto mb-20 flex w-full max-w-screen-lg flex-col overflow-hidden rounded-xl text-gray-900 md:flex-row md:border md:shadow-lg">
                            <form className="mx-auto w-full max-w-xl border-gray-200 px-10 py-8 md:px-8" onSubmit={handleClick} ref={formRef} >
                                <div className="mb-4"><label className="text mb-2 block font-medium" for="nom">Nom :</label><input className="w-full rounded border border-gray-300 px-3 py-2 outline-none ring-blue-500 focus:ring" id="nom" type="text" required="" /></div>
                                <div className="mb-4"><label className="text mb-2 block font-medium" for="email">Email :</label><input className="w-full rounded border border-gray-300 px-3 py-2 outline-none ring-blue-500 focus:ring" id="email" type="email" required="" /></div>
                                <div className="mb-4"><label className="text mb-2 block font-medium" for="subject">Sujet :</label><input className="w-full rounded border border-gray-300 px-3 py-2 outline-none ring-blue-500 focus:ring" id="sujet" type="sujet" required="" /></div>
                                <div className="mb-4"><label className="text mb-2 block font-medium" for="message">Message :</label><textarea className="h-52 w-full rounded border border-gray-300 px-3 py-2 outline-none ring-blue-500 focus:ring" id="message" required=""></textarea></div>
                                <div className="flex items-center justify-around">
                                {showPopup && (
                                    <div className="rounded-xl border bg-slate-50 border-gray-100 p-4 shadow-xlbg-slate-50 absolute mt-34">
                                        <div className="flex items-start gap-4">
                                            <span className="text-green-600">
                                                <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="h-6 w-6"
                                                >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                                </svg>
                                            </span>
                                        
                                            <div className="flex-1">
                                                <strong className="block font-medium text-gray-900"> Message envoyé !</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                    <div className="flex-1"></div>
                                    <button className="rounded-xl bg-blue-600 px-4 py-3 text-center font-bold text-white hover:bg-blue-700" type="submit">Envoyer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        case 'mentionslegales' :
            return(
                <div className="justify-start my-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-5">Mentions légales</h1>
                    <p>Voici les mentions légales de notre site de commerce électronique Fynal :</p>
                    <h2 className="text-sm font-bold mt-5">Hébergement</h2>
                    <p>Notre site est hébergé par Vercel, dont le siège social est situé à San Francisco, CA, USA.</p>
                    <h2 className="text-sm font-bold mt-5">Données personnelles</h2>
                    <p>Nous collectons des données personnelles (nom, adresse email, adresse postale, numéro de téléphone) pour traiter vos commandes et améliorer votre expérience utilisateur. Nous ne communiquons pas ces données à des tiers.</p>
                    <p>Vous pouvez accéder, modifier ou supprimer vos données personnelles en nous contactant par email ou par téléphone.</p>
                    <h2 className="text-sm font-bold mt-5">Propriété intellectuelle</h2>
                    <p>Tous les contenus présents sur le site Fynal (textes, images, vidéos, logos, etc.) sont protégés par le droit d'auteur et la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation préalable est interdite.</p>
                    <h2 className="text-sm font-bold mt-5">Limitation de responsabilité</h2>
                    <p>Nous ne sommes pas responsables des dommages directs ou indirects causés par l'utilisation de notre site ou de ses contenus. Nous nous réservons le droit de modifier ou de supprimer tout contenu à tout moment sans préavis.</p>
                </div>
            );
    }
}
