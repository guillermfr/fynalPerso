import {prisma} from "../../../../db";


export default async function handler(req, res){
    const Utilisateur = prisma.utilisateur;

    const {userId} = req.body;

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: {
                idUtilisateur: userId,
            },
            include: {
                Commande: {
                    include: {
                        PanierProduit: {
                            include: {
                                Produit: true,
                            },
                        },
                    },
                },
            },
        });

        const commandes = utilisateur.Commande;

        console.log(commandes)

        return res.status(200).json(commandes)
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Une erreur est survenue"})
    }
}