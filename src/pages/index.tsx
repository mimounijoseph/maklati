import Image from "next/image";
import { Geist, Geist_Mono ,Sansita_Swashed} from "next/font/google";
import Card from "@/components/card";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";

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
      // <Card/>
      <section className="p-3 flex justify-center gap-2 align-middle">
        <div>
      <h1 className="text-5xl mb-2 pt-[130px]" style={{fontFamily:"Sansita Swashed"}}>Easily Share Menus, <br /> Instantly Delight Customers</h1>
      <MorphoTextFlip
  words={["Easy", "Fast", "Delicious", "Smart", "Seamless", "Interactive", "Modern", "Convenient"]}
  textClassName="text-4xl md:text-7xl text-rose-600 dark:text-rose-400 font-bold mt-1"
  animationType="flipY"
/>
        </div>
<img src="hero_img.png" alt="burger" width="500px" />


      </section>
  );
}
