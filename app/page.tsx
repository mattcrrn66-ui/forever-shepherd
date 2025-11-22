"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-slate-900">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Left Image (1000028629.png) */}
        <div className="relative flex justify-center items-center">
          <Image
            src="/1000028629.png" // Left image path in /public directory
            alt="Left Image"
            width={500} // Adjust based on your preference
            height={500} // Adjust based on your preference
            className="rounded-lg shadow-lg drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]"
          />
        </div>

        {/* Right Image (1000028693.jpg) */}
        <div className="relative flex justify-center items-center">
          <Image
            src="/1000028693.jpg" // Right image path in /public directory
            alt="Right Image"
            width={500} // Adjust based on your preference
            height={500} // Adjust based on your preference
            className="rounded-lg shadow-lg drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]"
          />
        </div>

      </div>
      
      {/* Right Side Content (Title, Description, Action Button) */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl mt-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Welcome to CyberDev
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-8">
          The central hub for developers and creators to build, launch, and scale on Solana.
        </p>

        <a
          href="/launch"
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] transition-all"
        >
          Launch a Token
        </a>
      </div>
    </main>
  );
}
