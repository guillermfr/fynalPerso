/*
* Fonction de test pour filtrer un tableau. Le filtre appliqué permet d'avoir le tableau avec seulement 1 exemplaire de chaque valeur du tableau.
*/
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

/*
* Application du filtre
*/
export default function arrayUnique(array) {
    return array.filter(onlyUnique);
}