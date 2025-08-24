import Card from "@/components/card";
import React, { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import router, { useRouter } from "next/router";
import {
  Home,
  Briefcase,
  Pizza,
  Book,
  Sandwich,
  Salad,
  CupSoda,
} from "lucide-react";


import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Products() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  //const categories = ["Piza", "Tacos", "Drinks", "Desserts"];
  const categories = [
    {
      id: "Sandwiches & Paninis",
      label: "Sandwiches & Paninis",
      icon: Sandwich,
    },
    { id: "Soda", label: "Soda", icon: CupSoda },
    { id: "Pizza", label: "Pizza", icon: Pizza },
    { id: "Salads", label: "Salads", icon: Salad },
  ];
return (
  <div className="min-h-screen w-screen p-6 m-auto text-slate-900 bg-gradient-to-b from-amber-400 to-yellow-300">
    <header className="text-center mb-10">
      <h1 className="text-5xl font-bold text-black mb-1">Menu</h1>
      <p className="text-slate-700">Choose your favorite category</p>
    </header>

    <div className="w-full flex justify-center">
      <Tabs value={activeTab} onValueChange={setActiveTab}>

        <div className="inline-flex items-center rounded-2xl p-1.5
                        bg-slate-900/90 ring-1 ring-slate-800
                        shadow-[inset_0_-2px_0_rgba(255,255,255,0.06),0_8px_20px_rgba(17,24,39,0.35)]">
          <TabsList className="bg-transparent p-0 gap-1 flex">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="group relative flex items-center gap-2 rounded-xl
                             px-4 py-2 text-sm font-medium transition-all
                             data-[state=active]:bg-white data-[state=active]:text-slate-900
                             data-[state=inactive]:text-slate-200 hover:data-[state=inactive]:bg-slate-800/60
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                >
                  <Icon size={18} className="opacity-80 group-data-[state=active]:opacity-100" />
                  <span className="tracking-wide">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </Tabs>
    </div>

    <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
      <Card />
      <Card />
    </div>

    <AnimatedButton
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[200px]
                 bg-emerald-600 text-white hover:bg-emerald-700
                 shadow-[0_0_0_2px_rgba(16,185,129,0.35),0_10px_40px_rgba(16,185,129,0.45)]"
      variant="default"
      size="default"
      glow={false}
      textEffect="normal"
      uppercase={true}
      rounded="custom"
      shimmerColor="#34d399"
      shimmerSize="0.12em"
      shimmerDuration="2.6s"
      borderRadius="100px"
      background="rgba(16, 185, 129, 1)"
      onClick={() => router.push("/client/order")}
    >
      Order now
    </AnimatedButton>
  </div>
);

}

export default Products;
