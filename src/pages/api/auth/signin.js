import {signInSchema, saltRounds} from "../../../const";
const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';


export default async function handler(req, res){

    // Verification de la méthode de la requête
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    // Verification des données reçues à l'aide d'un schema pré-défini
    try {
        await signInSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {email, password} = req.body;

    // Récupération des informations de l'utilisateur dans la base de données grâce à son email
    const existingUser = await prisma.utilisateur.findUnique({
        where: { email },
    });

    // Si l'utilisateur n'existe pas, un message d'erreur est envoyé
    if(!existingUser){
        return res.status(409).json({message: 'L\'email ou le mot de passe est faux.'})
    }

    //Verification que le mot de passe entré et celui stocké correspondent
    const isValidPassword = await bcrypt
        .compare(password, existingUser.motDePasse)
        .catch(err => console.error(err.message))


    if (!isValidPassword) {
        return res.status(409).json({ message: 'L\'email ou le mot de passe est invalide.' });
    }

    // Retour de l'id de l'utilisateur
    const user = {
        idUtilisateur: existingUser.idUtilisateur,
    }

    return res.status(200).json(user);

}