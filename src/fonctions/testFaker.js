import { faker } from '@faker-js/faker';

class Product {
    constructor(nom, description, stock, delaisLivraison, prix, reduction, hauteur, longueur, largeur, poids, idCategorie, idVendeur) {
        this.nom = nom;
        this.description = description;
        this.stock = stock;
        this.delaisLivraison = delaisLivraison;
        this.prix = prix;
        this.reduction = reduction;
        this.hauteur = hauteur;
        this.longueur = longueur;
        this.largeur = largeur;
        this.poids = poids;
        this.idCategorie = idCategorie;
        this.idVendeur = idVendeur;
    }
}

// Fonction permettant de créer un faux produit, pouvant ensuite être utilisé pour faire des tests.
export function createRandomProduct() {
    const randomProduct = new Product(
        faker.commerce.product(),
        faker.commerce.productDescription(),
        // faker.datatype.number(100),
        10,
        faker.datatype.number(20),
        faker.datatype.float({min: 1, max: 1000, precision: 0.01}),
        10,
        faker.datatype.number(10000),
        faker.datatype.number(10000),
        faker.datatype.number(10000),
        faker.datatype.number(10000),
        faker.datatype.number({min: 1, max: 2}),
        1
    );

    return randomProduct;
}