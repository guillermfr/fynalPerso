import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Carousel } from "flowbite-react";
import { getProductIndex } from "../fonctions/productIndex";
import { ProductCard } from "../components/ProductCard";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import useSWR from "swr";

export async function getStaticProps() {
  const produitsIndex = (await getProductIndex()).produits;

  return {
    props: {
      produitsIndex,
    },
    revalidate: 60
  };
}

async function newCartData(product, commande, idUtilisateur) {
  const IDCOMMANDE = commande.idCommande === 0 ? 0 : commande.idCommande;
  const existItem =
    IDCOMMANDE === 0
      ? false
      : commande.PanierProduit.find((x) => x.idProduit === product.idProduit);
  const exist = existItem ? true : false;
  const quantity = existItem ? existItem.quantite + 1 : 1;
  if (product.stock < quantity) {
    alert("Produit plus en stock");
    return;
  }
  const response = await fetch("/api/panierAddButton", {
    method: "POST",
    body: JSON.stringify({
      idProduit: product.idProduit,
      idCommande: IDCOMMANDE,
      quantite: quantity,
      exist: exist,
      idUtilisateur: idUtilisateur,
    }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(response.statusText);
  }

  const updatedCart = await response.json();
  return updatedCart;
}

export default function Home({ produitsIndex }) {
  const [cookies] = useCookies(["user"]);
  const router = useRouter();
  const [cart, setCartItems] = useState(0);
  console.log(cart);
  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUtilisateur: cookies?.user?.idUtilisateur }),
    })
      .then((res) => res.json())
      .then((data) => {
        const InitialCart =
          data.length !== 0
            ? data
            : [{ idCommande: 0, idUtilisateur: cookies?.user?.idUtilisateur }];
        setCartItems(InitialCart[0]);
      });

  // Envoie de la requête à chaque chargement de la page à l'aide d'SWR
  const {
    data,
    error: errorSWR,
    isLoading: isLoadingSWR,
  } = useSWR(cookies["user"] ? "/api/getCommandStaticProps" : null, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  console.log(cart);
  const slider = [
    {
      id: 1,
      imageSrc:
        "https://www.mobilerelation.com.sg/image/catalog/images/Shop/banner_shop.jpg",
      imageAlt: "Product",
    },
    {
      id: 2,
      imageSrc:
        "https://frederiqueconstant.com/wp-content/uploads/others/fc_web_nft_page_header-1647525221667.webp",
      imageAlt: "Product",
    },
    {
      id: 3,
      imageSrc:
        "https://redlionbooks.co.uk/wp-content/uploads/2021/05/subscriptions-title-1.jpg",
      imageAlt: "Product",
    },
    {
      id: 4,
      imageSrc:
        "https://static.lenovo.com/sg/image/2022/cap-Warhammer-4k-Darktide-Gaming-dlp-banner-1920x400-1101.jpg",
      imageAlt: "Product",
    },
    {
      id: 5,
      imageSrc:
        "https://www.winnings.com.au/datadump/brand-modules/sub-zero-mod-1.jpg",
      imageAlt: "Product",
    },
  ];

  async function handleNewCartData(product, commande, idUtilisateur) {
    try {
      if (!cookies["user"]) {
        alert("Veuillez vous connecter pour ajouter un produit");
        router.push("/signin");
      }
      console.log(idUtilisateur);
      console.log(commande);
      const updatedProduct = await newCartData(
        product,
        commande,
        idUtilisateur
      );
      console.log(updatedProduct);
      //   setCartItems((prevCart) => {
      //     const updatedProducts = prevCart.PanierProduit.map((p) =>
      //       p.idProduit === updatedProduct.PanierProduit.idProduit ? updatedProduct.PanierProduit : p
      //     );
      //     console.log(updatedProducts);
      //     return { ...prevCart, PanierProduit: updatedProducts };
      setCartItems(updatedProduct);
      console.log(updatedProduct);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Fynal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="h-56 bg-black sm:h-78 xl:h-80 2xl:h-96 object-cover">
        <Carousel slideInterval={5000}>
          {slider.map((sliderElement) => (
            <img
              src={sliderElement.imageSrc}
              alt="..."
              className="w-full h-full"
              key={sliderElement.id}
            />
          ))}
        </Carousel>
      </section>
      <section className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <img src="/images/fast-delivery.png" alt="a"></img>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              Livraison
            </h6>
            <p className="mb-2 font-bold text-md">Rapide</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <img src="/images/credit-card.png" alt="a" className="w-10"></img>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              Paiement
            </h6>
            <p className="mb-2 font-bold text-md">En Ligne</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-teal-accent-400 sm:w-12 sm:h-12">
              <img src="/images/refund.png" alt="a" className="w-10"></img>
            </div>
            <h6 className="text-4xl font-bold text-deep-purple-accent-400">
              Retours
            </h6>
            <p className="mb-2 font-bold text-md">Gratuits</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="underline underline-offset-8 text-black decoration-slate-600 ml-4 lg:ml-56 font-sans font-semibold text-2xl">
          LES PRODUITS DU MOMENT
        </h2>
        <div className="bg-white -mt-14 sm:-ml-50s">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {produitsIndex.map((product) => (
                // <div key={product.idProduit} className="group relative">
                //   <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                //     <img
                //       src={product.image}
                //       alt={product.image}
                //       className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                //     />
                //   </div>
                //   <div className="mt-4 flex justify-between">
                //     <div>
                //       <h3 className="text-sm text-gray-700">
                //         <a href={product.href}>
                //           <span
                //             aria-hidden="true"
                //             className="absolute inset-0"
                //           />
                //           {product.name}
                //         </a>
                //       </h3>
                //       <p className="mt-1 text-sm text-gray-500">
                //         {product.color}
                //       </p>
                //     </div>
                //     <p className="text-sm font-medium text-gray-900">
                //       {product.price}
                //     </p>
                //   </div>
                // </div>

                <ProductCard
                  key={product.idProduit}
                  produit={product}
                  cart={cart}
                  idUtilisateur={cookies?.user?.idUtilisateur}
                  handleNewCartData={handleNewCartData}
                ></ProductCard>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="flex bg-slate-200 py-20 place-content-evenly">
        <div className="ml-42 mt-8 font-sans font-semibold text-2xl">
          <h3>Télécharger notre application</h3>
          <p>Disponible sur l'App Store et Google Play</p>
        </div>
        <div className="mt-0">
          <a href="#">
            <Image
              src="/images/apps.png"
              alt="img"
              height={200}
              width={200}
            ></Image>
          </a>
        </div>
      </section>
    </>
  );
}
