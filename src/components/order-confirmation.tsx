export const OrderConfirmation = () => {
  return (
    <div className="text-center bg-white/70 w-fit m-auto rounded-3xl px-10 py-5">
      <h2 className="text-2xl font-bold text-amber-600">Commande envoyée !</h2>
      <p className="mt-2 text-black">Merci pour votre commande. Veuillez patienter pendant son traitement...</p>
      <div className="mt-4 animate-pulse text-black">⌛ En attente...</div>
    </div>
  );
};
