"use client"

import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import Particles from "@/components/ui/particles";
import { RainbowButton } from "@/components/ui/rainbow-button";
import TypingAnimation from "@/components/ui/typing-animation";
import { pricingPlans } from "@/lib/mylib";
import { useAuth } from "@clerk/nextjs";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  let router=useRouter()
  let auth=useAuth()
  if (auth.isSignedIn) {
    router.push("/info")
  }
  return (
    <main className="bg-black w-full flex flex-col justify-center">
      <Nav />

      <Particles
        className="absolute inset-0 text-white mt-28"
        quantity={350}
        ease={80}
        color="#ffffff"
        refresh
        size={0.5}
      />

      <div className="mt-32">
        <TypingAnimation
          className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-gradient-to-b from-zinc-50 to-black bg-clip-text text-transparent"
          text="Discover The Powerful Hospital"
          duration={50}
        />
        <TypingAnimation
          className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-1 font-bold bg-gradient-to-b from-zinc-50 to-zinc-800 bg-clip-text text-transparent p-2"
          text="Appointment Management Tool"
          duration={50}
        />
      </div>
      <Button className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-white m-auto mt-7 hover:scale-105 hover:text-white relative z-10 px-8 rounded-full">
        <Link href="/sign-up">Get started</Link>
      </Button>

      <Image
        src="/dashbord_landing.png"
        alt="Dashboard Landing"
        width={800}
        height={600}
        className="rounded-t-2xl mx-auto relative z-10 mt-20"
      />

      <div className="mt-5 text-slate-100 font-semibold text-center p-5">
        <RainbowButton className="rounded-full">24k Plus Users Trust</RainbowButton>
      </div>

      <div>
        <Pricing />
      </div>
    </main>
  );
}

function Pricing() {
  let router=useRouter()
  return (
    <section className="w-full py-12 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <NeonGradientCard  className="p-0 outline-none bg-black">
            <Card key={index} className={`shadow-[0px_5px_0px_white] bg-black flex flex-col m-0${plan.popular ? 'border-black' : 'border-gray-200'}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-slate-100">{plan.name}</CardTitle>
                  {plan.popular && <div className="bg-white text-black p-2 rounded-full">Popular</div>}
                </div>
                <CardDescription className="text-slate-100">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4 text-slate-100">{plan.price}<span className="text-xl font-normal text-slate-100">/month</span></p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-white" />
                      <span className="text-slate-100">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.popular ? 'text-black bg-white hover:bg-gray-800' : 'text-white bg-black border border-white hover:bg-gray-100 hover:text-black'}`} onClick={()=>{router.push(`${plan.link}`)}}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
            </NeonGradientCard>
          ))}
        </div>
      </div>
    </section>
  );
}
