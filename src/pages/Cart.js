import React from "react";
import { useState } from "react";
import { getCategorieIdData } from "../fonctions/SidebarData";
import cookie from "cookie";
// import { useRouter } from "next/router";
// import { commandeUser } from "../fonctions/commandeUser";
// import isNotConnected from "../fonctions/isNotConnected";
import { prixReductionArrondi } from "../fonctions/prixReductionArrondi";

// récupération des cookies
function isAuth(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export async function getServerSideProps({ req }) {
  const cookies = isAuth(req);

  // // si l'user est pas connecté, on le renvois vers signin
  if (!cookies.user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  // const user = cookies.user;
  const user = JSON.parse(cookies.user);

  const categoriesSideMenu = await getCategorieIdData();
  const InitialCart = await prisma.commande.findMany({
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
    },
  });

  return {
    props: {
      user: user,
      categoriesSideMenu,
      InitialCart,
    },
  };
}

async function UpdateQuantity(product, quantity) {
  if (product.Produit.quantite < quantity) {
    const updatedCart = UpdateQuantity(product, product.Produit.quantite);
    return updatedCart;
  }

  if (quantity < 1) {
    const updatedCart = deleteProductFromCart(product);
    return updatedCart;
  }

  const response = await fetch("/api/cartUpdateQuantityButton", {
    method: "POST",
    body: JSON.stringify({
      idProduit: product.idProduit,
      idCommande: product.idCommande,
      quantite: quantity,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const updatedProduct = await response.json();
  return updatedProduct;
}

async function deleteProductFromCart(product) {
  const response = await fetch("/api/deleteProductFromCart", {
    method: "POST",
    body: JSON.stringify({
      idProduit: product.idProduit,
      idCommande: product.idCommande,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const updatedCart = await response.json();
  return updatedCart;
}

export default function Cart({ InitialCart, user }) {
  const [cart, setCart] = useState(InitialCart[0]);

  async function handleUpdateQuantity(product, quantity) {
    try {
      const updatedProduct = await UpdateQuantity(product, quantity);
      setCart(updatedProduct);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteProductFromCart(product) {
    try {
      const updatedCart = await deleteProductFromCart(product);
      setCart(updatedCart);
    } catch (error) {
      console.log(error);
    }
  }

  const totalPrice = cart?.PanierProduit?.reduce(
    (acc, currentValue) =>
      acc +
      prixReductionArrondi(
        currentValue.Produit.prix,
        currentValue.Produit.reduction
      ) *
        currentValue.quantite,
    0
  );

  const HT = prixReductionArrondi(totalPrice, 0);
  const TVA = Math.round((HT * 0.2 + Number.EPSILON) * 100) / 100;

  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                Votre panier
              </h1>
            </header>
            {cart ? (
              <div className="mt-8">
                {cart.PanierProduit.map((product) => {
                  return (
                    <ul key={product.Produit.idProduit} className="space-y-4">
                      <li
                        className="flex items-center gap-4"
                        key={product.Produit.idProduit}
                      >
                        <img
                          src={product.Produit.image}
                          alt={product.Produit.nom}
                          className="h-16 w-16 rounded object-cover"
                        />

                        <div>
                          <h2 className="text-sm text-gray-900">
                            {product.Produit.nom}
                          </h2>

                          <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                            <div>
                              <dt className="inline">Longueur:</dt>
                              <dd className="inline">
                                {product.Produit.longueur}
                              </dd>
                            </div>

                            <div>
                              <dt className="inline">Largeur:</dt>
                              <dd className="inline">
                                {product.Produit.largeur}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex flex-1 items-center justify-end gap-2">
                          <div>Prix : {product.Produit.prix}</div>
                          <form>
                            <label htmlFor="Line1Qty" className="sr-only"></label>

                            <button
                              onClick={async (e) => {
                                try {
                                  e.preventDefault();
                                  await handleUpdateQuantity(
                                    product,
                                    product.quantite + 1
                                  );
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              +
                            </button>
                            <span id="quantity">{product.quantite}</span>
                            <button
                              onClick={async (e) => {
                                try {
                                  e.preventDefault();
                                  await handleUpdateQuantity(
                                    product,
                                    product.quantite - 1
                                  );
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              -
                            </button>
                          </form>

                          <button
                            className="text-gray-600 transition hover:text-red-600"
                            onClick={async (e) => {
                              try {
                                e.preventDefault();
                                await handleDeleteProductFromCart(product);
                              } catch (err) {
                                console.log(err);
                              }
                            }}
                          >
                            <span className="sr-only">Supprimer Produit</span>

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    </ul>
                  );
                })}

                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <dt>Sous-total</dt>
                        <dd>{HT}</dd>
                      </div>

                      <div className="flex justify-between">
                        <dt>TVA</dt>
                        <dd>{TVA}</dd>
                      </div>

                      <div className="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>{TVA + HT}</dd>
                      </div>
                    </dl>

                    <div className="flex justify-end">
                      <a
                        href="/Shipping"
                        className="text-normal px-4 py-2 ml-auto text-white  bg-stone-800 hover:bg-stone-950 rounded-lg transition ease-in duration-200 focus:outline-none"
                      >
                        Paiement
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* <Link href="/">Panier vide</Link> */}
                <a href="/"> Panier vide</a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
