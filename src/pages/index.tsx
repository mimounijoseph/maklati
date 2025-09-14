// "use client";

// import Image from "next/image";
// import { Geist, Geist_Mono } from "next/font/google";
// import Card from "@/components/card";
// import { MorphoTextFlip } from "@/components/ui/morphotextflip";
// import { InteractiveInput } from "@/components/ui/interactive-input";
// import Layout from "./core/layout";

// import { useMemo } from "react";
// import { useTranslation } from "react-i18next";
// import "@/i18n.client"; 

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function Home() {
//   const { t, i18n } = useTranslation("common");

//   const words = useMemo(() => {
//     const arr = t("hero.words", { returnObjects: true }) as string[]; 
//     return Array.isArray(arr) ? arr : [];
//   }, [t, i18n.language]);

//   const handleStart = () => {
//     window.location.href = "/snack";
//   };

//   return (
//     <Layout>
//       <section className="p-3 flex flex-col md:flex-row justify-center gap-2 align-middle">
//         <div>
//           <h1
//             className="text-5xl mb-2 pt-[100px]"
//             style={{ fontFamily: "Sansita Swashed" }}
//           >
// <<<<<<< HEAD
//             {t("hero.title_line1")}
//             <br />
//             {t("hero.title_line2")}
// =======
//             Easily Share Menus,
//             <br />
//             Instantly Delight Customers
// >>>>>>> f06d193130d2fa889d4319b682836ee5ee9ae30b
//           </h1>

//           <MorphoTextFlip
//             words={words}
//             textClassName="text-4xl md:text-7xl font-bold mt-1"
//             animationType="flipY"
//           />

//           <InteractiveInput
//             className="text-white w-fit cursor-pointer mt-2"
//             variant="default"
//             inputSize="default"
//             glow={false}
//             rounded="custom"
//             hideAnimations={false}
//             uppercase={true}
//             textEffect="normal"
//             shimmerColor="white"
//             shimmerSize="0.09em"
//             shimmerDuration="3s"
//             borderRadius="100px"
//             background="transparent"
// <<<<<<< HEAD
//             placeholder={t("hero.cta")}
//             onClick={handleStart}
// =======
//             placeholder="Start now"
//             onClick={() => (window.location.href = "/snack")}
// >>>>>>> f06d193130d2fa889d4319b682836ee5ee9ae30b
//           />
//         </div>

//         <Image
//           src="/hero_img.png"
//           alt={t("hero.image_alt")}
//           width={500}
//           height={400}
//           priority
//         />
//       </section>
//     </Layout>
//   );
// }
