import React, { useEffect } from "react";
import CheckoutStepsOrder from "../components/CheckoutStepsOrder";
import { useState } from "react";
import { useRouter } from "next/router";
import isNotConnected from "../fonctions/isNotConnected";
import cookie from "cookie";
import { prisma } from "../../db";

function isAuth(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export async function getServerSideProps({ req }) {
  const cookies = isAuth(req);

  // // si l'user est pas connecté, on le renvois vers signin
  isNotConnected(cookies);
  // const user = cookies.user;
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
      : [{ idCommande: 0, method_payment: false, idAdresse: false }];
  if (!InitialCart[0].idAdresse) {
    return {
      redirect: {
        destination: "/Shipping",
        permanent: false,
      },
    };
  }
  return {
    props: {
      InitialCart,
    },
  };
}

export default function payment({ InitialCart }) {
  const [paymentMethod, setPaymentMeth] = useState("");

  const [cart, setCart] = useState(InitialCart[0]);

  console.log(cart);

  const router = useRouter();

  useEffect(() => {
    if (!cart.idAdresse) {
      router.push("/Shipping");
    }

    setPaymentMeth(cart.method_payment || "");
  }, [cart.method_payment, router, cart.idAdresse]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      return alert("Veuillez choisir un mode de paiement");
    }

    const response = await fetch("/api/setPaymentMethod", {
      method: "POST",
      body: JSON.stringify({
        method_payment: paymentMethod,
        idCommande: cart.idCommande,
      }),
    });

    const updatedProduct = await response.json();
    console.log(response);
    if (!response.ok) {
      console.log(response);
      throw new Error(response.statusText);
    }

    router.push("/order");
  };

  let idPayment = 1;

  return (
    <>
      <CheckoutStepsOrder activeStep={2} />
      <form onSubmit={submitHandler}>
        <section className="max-w-[900px] mx-auto px-8 pt-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-8 text-center">
            Moyen de paiement :
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {["Mastercard", "Visa", "Paypal"].map((payment) => (
              <label
                htmlFor={payment}
                className="relative w-full corsor-pointer"
                key={idPayment++}
              >
                <input
                  className="peer hidden"
                  type="radio"
                  id={payment}
                  name="paymentMeth"
                  checked={paymentMethod === payment}
                  onChange={() => setPaymentMeth(payment)}
                  required
                />
                <div
                  className="flex items-center sm:justify-center
                p-5 pr-16 sm:p-8 gap-5
                h-24 sm:h-40 w-full
                bg-white
                border-2 border-gray-200
                rounded-md transition
                peer-checked:border-blue-500
                peer-checked:shadow-lg
                peer-checked:-translate-y-1"
                >
                  <img
                    className="w-20 h-16 sm:w-full sm:h-full object-center"
                    src={`/logo_${payment}.svg`}
                    alt={payment}
                  />
                  <p
                    className="static sm:absolute 
                  top-full sm:mt-1 
                  text-center text-lg sm:text-xl 
                  w-auto sm:w-full 
                  opacity-70 font-medium"
                  >
                    Payer avec {payment}
                  </p>
                </div>
                <div
                  className="absolute top-1/2 sm:-top-4 right-6 sm:-right-3 
                -translate-y-1/2 sm:translate-y-0 -mt-1
                bg-blue-500 text-white 
                h-8 w-8 p-0.5 
                rounded-full transition 
                peer-checked:scale-100 scale-0"
                >
                  <img src="/icon_check.svg" alt="" />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-20 flex justify-between">
            <button
              onClick={() => router.push("/Shipping")}
              type="button"
              className="
                text-normal px-4 py-2 text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none"
            >
              Retour
            </button>
            <button className="text-normal px-4 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none">
              Poursuivre
            </button>
          </div>
        </section>
      </form>
    </>
  );
}
