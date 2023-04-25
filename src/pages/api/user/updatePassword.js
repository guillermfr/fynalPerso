import {passwordProfileSchema, saltRounds} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){

    // Verification de la méthode de la requête
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    // Verification des données reçues à l'aide d'un schema pré-défini
    try {
        await passwordProfileSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {userId, actualPassword, password, confirmPassword} = req.body;

    try{
        // Recherche de l'utilisateur dans la base de donnée, le bloc try, catch recuperera l'erreur en cas de besoin
        // si l'utilisateur n'est pas trouvé par exemple
        const existingUser = await prisma.utilisateur.findUnique({
            where:{
                idUtilisateur: userId
            },
        });

        // Verification de l'ancien mot de passe avec celui de la base de donnée
        const isValidPassword = await bcrypt
            .compare(actualPassword, existingUser.motDePasse)
            .catch(err => console.error(err.message))


        if (!isValidPassword) {
            return res.status(409).json({ message: 'Le mot de passe est invalide.' });
        }

        // Hashage du nouveau mot de passe
        const hashedPassword = await bcrypt
            .hash(password, saltRounds)
            .catch(err => console.error(err.message))

        // Changement du mot de passe hashé dans la base de donnée
        const changedUser = await prisma.utilisateur.update({
            where:{
                idUtilisateur: userId
            },
            data: {
                motDePasse: hashedPassword,
            }
        });

        return res.status(200).json({});

    }catch (err){
        console.log(err);
        return res.status(500).json({err, message: 'Erreur lors de l\'enregistrement'});
    }


    return res.status(500).json({ message: 'Erreur lors de l\'enregistrement'});

}