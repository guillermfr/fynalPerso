import React from "react";

/*
* Component permettant d'afficher un footer sur la page.
* Cet élément doit être présent sur toutes les pages, il est donc intégré dans le component Layout.
*/
export default function Footer(){
    return(
        <footer className="footer items-center flex place-content-between p-3 bg-black text-neutral-content bottom-0 fixed mt-0">
            <div className="flex">
                <a className="text-2xl ml-5">fynal</a>
                <p className="mt-2 ml-5">Copyright © 2023</p>
            </div>
                <div className="text-sm space-x-2 flex">
                    <a href="/FooterRedirect/?q=about">À propos</a>
                    <a href="/FooterRedirect/?q=contact">Contact</a>
                    <a href="/FooterRedirect/?q=mentionslegales">Mentions Légales</a>
                </div>
        </footer>
    )
}