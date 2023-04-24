import {idUserSchema} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){

    // Verification de la méthode de la requête
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    // Verification des données reçues à l'aide d'un schema pré-défini
    try {
        await idUserSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId} = req.body;

    try{
        // Récupération des informations de l'utilisateur dans la base de données grâce à son id
        // Le bloc try, catch permet de récupérer les erreurs en cas de besoin, si l'utilisateur n'est pas trouvé par exemple
        let status = 0
        const userData = await prisma.utilisateur.findUnique({
            where:{
                idUtilisateur: userId
            },
            include:{
                Adresse: true
            },
        });

        // Calcul du statut de l'utilisateur : simple acheteur(0), vendeur(1), livreur(2) ou admin(3)
        if(userData.idUtilisateur === 0){
            status = 3;
        }
        else{
            const sellerStatus = await prisma.vendeur.findUnique({
                where: { idUtilisateur: userData.idUtilisateur },
            });
            const deliveryStatus = await prisma.livreur.findUnique({
                where: { idUtilisateur: userData.idUtilisateur },
            });
            if(sellerStatus?.Valide){
                status = 1;
            }
            else if(deliveryStatus?.Valide){
                status = 2;
            }

        }

        // Stockage des infos dans un objet
        const user = {
            idUtilisateur: userData.idUtilisateur,
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            status: status,
            genre: userData.genre,
            dateNaissance: userData.dateNaissance,
            adresse: userData.Adresse,
        }
        // Envoie de l'objet contenant les infos de l'utilisateur au côte client
        return res.status(200).json(user);

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}