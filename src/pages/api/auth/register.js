import * as Yup from "yup";
import {registerSchema, saltRounds} from "../../../const";

const bcrypt = require("bcryptjs");
import { prisma } from '../../../../db';

export default async function handler(req, res){

    // Verification de la méthode de la requête
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    // Verification des données reçues à l'aide d'un schema pré-défini
    try {
        await registerSchema.validate(req.body);
    }catch (error){
        return res.status(400).json({error, message: 'Erreur dans le formulaire'})
    }

    const {firstName, lastName, email, password, confirmPassword} = req.body;

    // Récupération des informations de l'utilisateur dans la base de données grâce à son email
    const existingUser = await prisma.utilisateur.findUnique({
        where: { email },
    });

    // Si l'utilisateur existe, un message d'erreur est envoyé
    if(existingUser){
        return res.status(409).json({message: 'Un utilisateur avec cet email existe déjà.'})
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt
        .hash(password, saltRounds)
        .catch(err => console.error(err.message))

    // Ajoute le nouvel utilisateur dans la base de données
    const newUser = await prisma.utilisateur.create({
        data: {
            nom: lastName,
            prenom: firstName,
            email: email,
            motDePasse: hashedPassword,
        }
    });

    return res.status(200).json({message: 'Succès de l\'enregistrement'});

}