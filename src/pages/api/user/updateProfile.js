import {profileSchema} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){

    // Verification de la méthode de la requête
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    // Verification des données reçues à l'aide d'un schema pré-défini
    try {
        await profileSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId, firstName, lastName, email, birthDate, sex} = req.body;

    try{
        // Mise à jour des informations de l'utilisateur dans la base de données
        // Le bloc try, catch permet de récupérer les erreurs en cas de besoin, si l'utilisateur n'est pas trouvé par exemple
        const changedUser = await prisma.utilisateur.update({
            where:{
                idUtilisateur: userId
            },
            data: {
                nom: lastName,
                prenom: firstName,
                email: email,
                dateNaissance: birthDate,
                genre: sex
            }
        });

        return res.status(200).json({});

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}