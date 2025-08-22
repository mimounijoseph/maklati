export const OrderConfirmation = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600">Commande envoyée !</h2>
      <p className="mt-2">Merci pour votre commande. Veuillez patienter pendant son traitement...</p>
      <div className="mt-4 animate-pulse">⌛ En attente...</div>
    </div>
  );
};
