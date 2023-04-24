import React, {useEffect} from "react";
import Nav from './Nav';
import Footer from './Footer';
import {useCookies} from "react-cookie";
import useSWR from 'swr'

/*
* Component global du site, il est intégré dans le fichier _app afin qu'il soit présent sur toutes les pages.
*/ 
export default function Layout({ children }) {

    const [cookies, setCookies, removeCookie] = useCookies(['user']);

    // Requête fetch permettant de récupérer les informations de l'utilisateur et de les stocker dans le cookie
    const fetcher = url => fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: cookies?.user?.idUtilisateur})
    })
        .then((res) => res.json())
        .then((data) => {
            const maxAge = cookies.user.maxAge
            setCookies('user', data, {
                path: '/',
                maxAge: maxAge,
            })
        })

    // Envoie de la requête à chaque chargement de la page à l'aide d'SWR
    const {error:errorSWR, isLoading: isLoadingSWR} = useSWR(cookies['user'] ? '/api/user/getSessionData' : null, fetcher, {

    })

  return (  
    <>
      <Nav childrenProps={children.props.categoriesSideMenu} />
          {children}  
      <Footer />
    </>
  )
}