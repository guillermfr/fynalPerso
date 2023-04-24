import {prisma} from "../../../../db";

export default async function handler(req, res){

    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Méthode non autorisée.'});
    }

    const {userId, status} = req.body;

    try {
        if(status === 3){
            console.log(status)
            const contrats = await prisma.contrat.findMany({
                include:{
                    ContratVendeur: true,
                    ContratLivreur: true
                },
                orderBy:{
                    etat: "asc"
                }
            })
            return res.status(200).json(contrats)
        }
        else{
            const utilisateur = await prisma.utilisateur.findUnique({
                where: {
                    idUtilisateur: userId,
                },
                include: {
                    Contrat: {
                        include: {
                            ContratVendeur: true,
                            ContratLivreur: true,
                        },
                        orderBy:{
                            etat: "asc"
                        }
                    },
                },
            });
            const contrats = utilisateur.Contrat
            return res.status(200).json(contrats)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Une erreur est survenue"})
    }
}