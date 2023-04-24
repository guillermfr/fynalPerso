import * as Yup from "yup";

export const idUserSchema = Yup.object().shape({
    userId: Yup.number()
})

export const baseDataSchema = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .required("L prénom est requis")
        .matches(/^[A-Za-z\-]{1,20}$/, "Seuls les minuscules et les majuscules sont autorisées"),
    lastName: Yup.string()
        .trim()
        .required("Le nom est requis")
        .matches(/^[A-Za-z ]{1,20}$/, "Seuls les minuscules et les majuscules sont autorisées"),
    email: Yup.string()
        .trim()
        .required("L'email est requis")
        .email("L'email n'est pas valide"),
});

export const passwordSchema = Yup.object().shape({
    password: Yup.string()
        .required("Le mot de passe est requis")
        .min(8)
        .max(25)
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:|,.\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};:|,.\/?]{8,}$/, "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial parmis ceux là !@#$%^&*()_+-=[]{};:|,./?"),
    confirmPassword: Yup.string()
        .required("Le mot de passe de confirmation est requis")
        .oneOf([Yup.ref("password"), null], "Les mots de passes doivent correspondrent"),
});

export const simplePasswordSchema = Yup.object().shape({
    actualPassword: Yup.string()
        .required("Le mot de passe actuel est requis pour pouvoir le changer")
})

export const otherProfileDataSchema = Yup.object().shape({
    birthDate: Yup.date()
        .nullable()
        //.min(new Date().setFullYear(new Date().getFullYear()-150), "Erreur de la date de naissance")
        .max(new Date(), "Erreur de la date de naissance"),
    sex: Yup.string()
        .nullable()
        .oneOf(["Homme", "Femme", "Autre"], "Erreur lors du choix du genre")
})

export const signInSchema = Yup.object().shape({
    email: Yup.string().email("L'email n'est pas valide").required("L'email est requis"),
    password: Yup.string().required("Le mot de passe est requis"),
});

export const addressSchema = Yup.object().shape({
    addressBody: Yup.string()
        .when(['addressAddition', 'postcode', 'city', 'country'],{
            is: (addressAddition, postcode, city, country) => addressAddition || postcode || city || country,
            then: () => Yup.string().required()
        }, "Le corps de l'adresse est requis si l'un des autres champs sauf le compléments est remplis"),
    addressAddition: Yup.string(),
    postcode: Yup.number().min(5).max(5)
        .when(['addressBody', 'addressAddition', 'city', 'country'], {
            is: (addressBody, addressAddition, city, country) => addressBody || addressAddition || city || country,
            then: () => Yup.string().required()
        }, "Le code postale est requis si l'un des autres champs sauf le compléments est remplis"),
    city: Yup.string()
        .when(['addressBody', 'addressAddition', 'postcode', 'country'], {
            is: (addressBody, addressAddition, postcode, country) => addressBody || addressAddition || postcode || country,
            then: () => Yup.string().required()
        }, "La ville est requise si l'un des autres champs sauf le compléments est remplis"),
    country: Yup.string()
        .when(['addressBody', 'addressAddition', 'postcode', 'city'], {
            is: (addressBody, addressAddition, postcode, city) => addressBody || addressAddition || postcode || city,
            then: () => Yup.string().required()
        }, "Le pays est requis si l'un des autres champs sauf le compléments est remplis"),
},
[
    ['addressBody', 'addressAddition'], ['addressBody', 'postcode'], ['addressBody', 'city'], ['addressBody', 'country'],
    ['postcode', 'addressAddition'], ['postcode', 'city'], ['postcode', 'country'],
    ['city', 'addressAddition'], ['city', 'country'],
    ['country', 'addressAddition']
])

export const contractSchema = Yup.object().shape({
    contractType: Yup.string()
        .required("Le type de contrat est requis")
        .oneOf(["Seller", "Deliverer"], "Erreur lors du choix du type de contrat"),
    startDate: Yup.date()
        .required("La date de début est requise")
        .min(new Date(), "Erreur dans la date de début du contrat"),
    endDate: Yup.date()
        .required("La date de fin est requise")
        .min(Yup.ref("startDate")),
    company: Yup.string().
        required("L'entreprise affiliée est requise"),
    commission: Yup.number()
        .when("contractType", {
            is: (contractType) => contractType === "Seller",
            then: () => Yup.number()
                .required("La commission est requise")
                .min(0, "Le minimum possible de la commission est de 0")
                .max(100, "Le maximum possible de la commission est de 100")
        }),
    license: Yup.string()
        .when("contractType", {
            is: (contractType) => contractType === "Deliverer",
            then: () => Yup.number()
                .required("Le permis est requis")
        }),
    vehicle: Yup.string()
        .when("contractType", {
            is: (contractType) => contractType === "Deliverer",
            then: () => Yup.number()
                .required("Le vehicule est requis")
        }),

})

export const registerSchema =  baseDataSchema.concat(passwordSchema);
export const profileSchema = baseDataSchema.concat(otherProfileDataSchema);
export const passwordProfileSchema = simplePasswordSchema.concat(passwordSchema);
export const saltRounds = 10;
export const SESSION_NAME = 'fynal_session';
