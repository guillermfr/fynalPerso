export function prixReductionArrondi(prix, reduction) {
    return Math.round(((prix - (reduction/100)*prix) + Number.EPSILON) * 100) / 100
}