import { prisma } from "../../db";
import arrayUnique from "./uniqueValuesFromArray";

export async function getProductsData(searchTerm) {
    // Recherche des produits qui ont un nom contenant le searchTerm 
    const produits = await prisma.produit.findMany({
      where: {
        OR: [
          { nom: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    })
    
   // Filtrage des vendeurs uniques dans les produits trouvés
    const vendeurFiltre = arrayUnique( 
      produits.map((produit) => { 
          return produit.idVendeur 
      })
    );
    
    // Recherche des vendeurs correspondants aux vendeurs filtrés
    const vendeurs = await prisma.vendeur.findMany({
        select: {
            idVendeur: true,
            idEntreprise: true,
        },
        where: {
            idVendeur: { in: vendeurFiltre },
        }
    });

    const utilisateursVendeursFiltre = arrayUnique( 
        vendeurs.map((vendeur) => { 
            return vendeur.idUtilisateur 
        })
    );

    const utilisateursVendeurs = await prisma.utilisateur.findMany({
        where: {
            idUtilisateur: { in: utilisateursVendeursFiltre }
        },
        select: {
            idUtilisateur: true,
            nom: true,
            prenom: true,
        }
    })
  
    // Retourne un objet contenant les produits, les vendeurs et les entreprises correspondants
    return {
        produits,
        vendeurs,
        utilisateursVendeurs,
    }
}
