
# PROJET WEB : FYNAL

Rendu de projet de dev-web en __Ing-1 23/04/2023__.  

Ce projet est réalisé dans le cadre de la matière "Développement Web" au second semestre de la première année de formation d'ingénieur en informatique de *CY Tech*.   

Ce site est une MarkertPlace fait avec __NextJs__, __Prisma__ et __Supabase__. 

Sur cette MarketPlace vous pouvez trouver tout type de produits un peu comme Amazon ou Ebay



## Installation

#### Installer ce projet avec les commandes suivantes

 Installer NodeJS si nécessaire

Instructions pour utiliser le site :
* dans un terminal, aller dans un fichier où vous voulez mettre le site
* faire la commande suivante : `npx create-next-app@latest`
* appuyer sur `y` pour installer create-next-app@13.3.1
* donner un nom au dossier
* TypeScript -> `No`
* ESLint -> `No`
* Tailwind -> `No`
* use src/ directory -> `Yes`
* experimental app/ directory -> `No`
* import alias -> directement appuyer sur entrée
* prendre tous les fichiers de la branche main sur GitHub et les mettre à la racine du projet
* faire la commande : `npm install`
* faire la commande : `npm update`
* faire la commande : `npx prisma init`
* dans le fichier .env, mettre le lien suivant entre les guillemets de la variable DATABASE : postgresql://postgres:marketplacefynal2023@db.qpmkgursonidxktaknpq.supabase.co:5432/postgres
* faire la commande : `npx prisma db pull`
* faire la commande : `npx prisma generate`
* enfin, lancer le serveur avec la commande (et réexecuter la commmande à chaque démarrage du serveur) : `npm run dev`
* pour ensuite accéder au site, aller sur le lien : http://localhost:3000
    
## Deployment

To deploy this project run

```bash
  npm run dev
```


## API Reference

#### .ENV

```http
DATABASE_URL="postgresql://postgres:marketplacefynal2023@db.qpmkgursonidxktaknpq.supabase.co:5432/postgres""
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `DATABASE_URL` | `string` | **Required**. Your API key |



## Authors

- [@François](https://github.com/guillermfr)
- [@Lucas](https://github.com/Venkkay)
- [@Nino](https://github.com/NinoHamel)
- [@Yenni](https://github.com/Yenni-tdr)
- [@Adrien](https://github.com/Drien95)

