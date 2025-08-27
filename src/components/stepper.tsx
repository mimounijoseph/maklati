export const Stepper = ({ step }: { step: number }) => {
  const steps = ["Add your order", "Validate your order", "Wait for your order"];

  return (
    <div className="flex justify-around mb-6 md:w-[60%] md:mx-auto ">
      {steps.map((label, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step === index + 1 ? "bg-amber-600 text-white" : "bg-white text-black"
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
