import { prisma } from "../../../db";

export default async function handler(req, res) { // Fonction handler pour gérer les requêtes à l'API
  if (req.method === "POST") { // Vérification de la méthode de requête, POST requis
    const { commandes } = JSON.parse(req.body); // Extraction des données du corps de la requête

    try {
      await prisma.commande.updateMany({ // Mise à jour des enregistrements dans la table "commande"
        where: { idCommande: { in: commandes } }, // Utilisation des données extraites pour définir les enregistrements à mettre à jour
        data: { etatCommande: 2 }, // Définition de la nouvelle valeur de l'état de commande
      });

      res.status(200).json({ message: "État des commandes mis à jour avec succès" }); // Réponse JSON avec un message de succès
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'état des commandes" }); // Réponse JSON avec un message d'erreur
    } finally {
      await prisma.$disconnect(); // Fermeture de la connexion à la base de données
    }
  } else {
    res.status(400).json({ error: "Mauvaise méthode de requête. Utilisez POST" }); // Réponse JSON avec un message d'erreur pour une mauvaise méthode de requête
  }
}
