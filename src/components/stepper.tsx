export const Stepper = ({ step }: { step: number }) => {
  const steps = ["Produits", "Validation", "Attente"];

  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step === index + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>
          <span className="text-sm mt-2">{label}</span>
        </div>
      ))}
    </div>
  );
};
