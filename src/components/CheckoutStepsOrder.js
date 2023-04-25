import React from "react";

export default function CheckoutStepsOrder({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {["Connexion", "Adresse de livraison", "Moyen de paiement", "Achat"].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2 text-center ${
              index <= activeStep
                ? "border-stone-900 text-stone-900 font-semibold pt-3  pb-3"
                : "border-gray-400 text-gray-400 pt-3  pb-3"
            }`}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}
