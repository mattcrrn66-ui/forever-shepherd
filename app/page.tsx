"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Character Left Side */}
        <div className="relative">
          <Image
            src="/cyberdev-character.png" // <-- PUT YOUR IMAGE IN /public
            alt="CyberDev Mascot"
            width={320}
            height={320}
            className="drop-shadow-[0_0_20px_rgba(0,200,255,0.35)]"
          />
        </div>

        {/* Right Side Content (Hero + Action Button) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            CyberDev Intelligence Hub
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8">
            Build. Launch. Scale. The future of Solana lives here.
          </p>

          <div className="flex justify-center md:justify-start gap-6">
            <a
              href="/launch"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] transition-all"
            >
              Launch a Token
            </a>

            <a
              href="/comfy"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] transition-all"
            >
              Generate AI Images for Free
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
