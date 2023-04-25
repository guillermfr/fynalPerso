import React, { useContext, useEffect } from "react";
import CheckoutStepsOrder from "../components/CheckoutStepsOrder";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import cookie from "cookie";
import isNotConnected from "../fonctions/isNotConnected";
import { prisma } from "../../db";

function isAuth(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export async function getServerSideProps({ req }) {
  const cookies = isAuth(req);

  // // si l'user est pas connecté, on le renvois vers signin
  isNotConnected(cookies);
  const user = JSON.parse(cookies.user);

  const Cart = await prisma.commande.findMany({
    where: {
      idUtilisateur: user.idUtilisateur,
      etatCommande: 0,
    },
    include: {
      PanierProduit: {
        include: {
          Produit: true,
        },
      },
      Adresse: true,
    },
  });
  const InitialCart =
    Cart.length !== 0
      ? Cart
      : [
          {
            idCommande: 0,
            method_payment: false,
            idAdresse: false,
            Utilisateur: false,
            PanierProduit: false,
          },
        ];
  if (!InitialCart[0].PanierProduit) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      InitialCart,
      user,
    },
  };
}

export default function Shipping({ InitialCart, user }) {
  const [cart, setCart] = useState(InitialCart);

  console.log(cart[0]);
  const router = useRouter();

  console.log(cart[0].PanierProduit);

  useEffect(() => {
    if (!cart[0].PanierProduit) {
      router.push("/");
    }
  }, [router, cart[0].PanierProduit]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    formState,
  } = useForm();

  const { isSubmitting } = formState;

  const submitHandler = async ({
    numeroNomRue,
    complement,
    ville,
    codePostal,
    pays,
  }) => {
    // await wait(1000);
    const response = await fetch("/api/shippingAdress", {
      method: "POST",
      body: JSON.stringify({
        idCommande: cart[0].idCommande,
        idUtilisateur: cart[0].idUtilisateur,
        AdressePrev: cart[0].Adresse,
        numeroNomRue: numeroNomRue,
        ville: ville,
        complement: complement,
        codePostal: Number(codePostal),
        pays: pays,
      }),
    });
    console.log(response);
    if (!response.ok) {
      console.log(response);
      throw new Error(response.statusText);
    }

    const updatedProduct = await response.json();
    router.push("/payment");
  };

  const shippingAdress = cart[0].Adresse
    ? cart[0].Adresse
    : user.adresse || false;

  return (
    <>
      <CheckoutStepsOrder activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-6  text-xl font-bold text-gray-900 sm:text-3xl text-center mt-8">
          Adresse de livraison
        </h1>
        <div className="mb-4">
          <label htmlFor="Nom">Rue</label>
          <input
            defaultValue={shippingAdress.numeroNomRue}
            className=" w-full border-solid border-2  rounded border-black py-1 px-1"
            id="numeroNomRue"
            autoFocus
            {...register("numeroNomRue", {
              required: "Veuillez rentrer une rue",
              minLength: { value: 5, message: "5 caractère requis" },
            })}
          />
          {errors.numeroNomRue && (
            <div className="text-red-500">{errors.numeroNomRue.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Nom">Complément d'adresse</label>
          <input
            defaultValue={shippingAdress.complement}
            className="w-full border-solid border-2  rounded border-black  py-1 px-1"
            id="complement"
            autoFocus
            {...register("complement", {
              required: false,
            })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Nom">Ville</label>
          <input
            defaultValue={shippingAdress.ville}
            className="w-full border-solid border-2  rounded border-black  py-1 px-1"
            id="ville"
            autoFocus
            {...register("ville", {
              required: "Veuillez rentrer une ville",
              minLength: { value: 5, message: "5 caractère requis" },
            })}
          />
          {errors.ville && (
            <div className="text-red-500">{errors.ville.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Nom">codePostal</label>
          <input
            defaultValue={shippingAdress.codePostal}
            className="w-full border-solid border-2  rounded border-black  py-1 px-1"
            id="codePostal"
            autoFocus
            {...register("codePostal", {
              required: "Veuillez rentrer un code postal",
              pattern: {
                value: /^[0-9]{3,10}$/,
                message: "Veuillez ne rentrer que des chiffres",
              },
              minLength: { value: 3, message: "3 chiffres requis" },
            })}
          />
          {errors.codePostal && (
            <div className="text-red-500">{errors.codePostal.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Nom">Pays</label>
          <input
            defaultValue={shippingAdress.pays}
            className="w-full border-solid border-2  rounded border-black  py-1 px-1"
            id="pays"
            autoFocus
            {...register("pays", {
              required: "Veuillez rentrer un pays",
              minLength: { value: 5, message: "5 caractère requis" },
            })}
          />
          {errors.pays && (
            <div className="text-red-500">{errors.pays.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button
            disabled={isSubmitting}
            className=" text-normal px-4 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}
