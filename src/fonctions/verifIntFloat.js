/*
* Fonction permettant de tester si une chaîne de caractère est un entier ou non
*
* Valeur de retour : booléen en fonction du résultat
*/
export function isInt(n) {
    return Number.isInteger(Number(n));
}

/*
* Fonction permettant de tester si une chaîne de caractère est un float ou non
*
* Valeur de retour : booléen en fonction du résultat
*/
export function isFloat(n) {
    const floatN = Number(n);
    return Number(floatN) === floatN && floatN % 1 !== 0;
}

/*
* Fonction permettant de tester si une valeur est (strictement) positive ou non
*
* Valeur de retour : booléen en fonction du résultat
*/
export function isPositive(n, type) {
    if(type == 0) return n >= 0;
    else return n > 0;
}

/*
* Fonction permettant de tester si une chaîne de caractère est un entier positif ou non
*
* Valeur de retour : booléen en fonction du résultat
*/
export function verifIntPositive(n, type) {
    return isInt(n) && isPositive(parseInt(n), type);
}

/*
* Fonction permettant de tester si une chaîne de caractère est un float/entier positif ou non
*
* Valeur de retour : booléen en fonction du résultat
*/
export function verifFloatPositive(n, type) {
    return ( isFloat(n) || isInt(n) ) && isPositive(parseFloat(n), type);
}