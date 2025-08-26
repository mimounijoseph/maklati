import Image from "next/image";
import { Geist, Geist_Mono, Sansita_Swashed } from "next/font/google";
import Card from "@/components/card";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";
import { InteractiveInput } from "@/components/ui/interactive-input";
import Layout from "./core/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <Layout>
      <section className="p-3 flex flex-col md:flex-row justify-center gap-2 align-middle">
        <div>
          <h1
            className="text-5xl mb-2 pt-[100px]"
            style={{ fontFamily: "Sansita Swashed" }}
          >
            Easily Share Menus,
            <br /> Instantly Delight Customers
          </h1>
          <MorphoTextFlip
            words={[
              "Easy",
              "Fast",
              "Delicious",
              "Seamless",
              "Interactive",
              "Modern",
              "Convenient",
            ]}
            textClassName="text-4xl md:text-7xl  font-bold mt-1"
            animationType="flipY"
          />
          <InteractiveInput
            className=" text-white w-fit cursor-pointer mt-2"
            variant="default"
            inputSize="default"
            glow={false}
            rounded="custom"
            hideAnimations={false}
            uppercase={true}
            textEffect="normal"
            shimmerColor="white"
            shimmerSize="0.09em"
            shimmerDuration="3s"
            borderRadius="100px"
            background="transparent"
            placeholder="Start now"
          />
        </div>
        <img src="hero_img.png" alt="burger" width="500px" />
      </section>
    </Layout>
  );
}
