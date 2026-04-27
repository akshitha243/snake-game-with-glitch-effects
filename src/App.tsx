import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center selection:bg-fuchsia-500/50 font-sans p-4 space-y-6 md:space-y-10 relative overflow-hidden tear">
      
      {/* Glitch & Noise Effects */}
      <div className="scanlines" />
      <div className="noise-bg" />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-cyan-500 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-fuchsia-500 animate-[pulse_2s_infinite]" />

      {/* Header */}
      <header className="w-full max-w-4xl pt-8 pb-4 flex flex-col items-center justify-center z-10">
        <h1 className="font-mono text-2xl md:text-3xl tracking-tighter uppercase text-center flex items-center justify-center gap-4 border-b-4 border-fuchsia-500 pb-4 w-full relative group">
          <Terminal className="text-cyan-400 w-8 h-8 animate-ping" />
          <span className="text-white bg-black px-2 relative inline-block before:content-['O_R_B_I_T_A_L__S_Y_N_D_I_C_A_T_E'] before:absolute before:left-[3px] before:text-cyan-500 before:top-0 before:-z-10 after:content-['O_R_B_I_T_A_L__S_Y_N_D_I_C_A_T_E'] after:absolute after:left-[-3px] after:text-fuchsia-500 after:top-0 after:-z-10 glitch-anim mix-blend-screen">
            O_R_B_I_T_A_L__S_Y_N_D_I_C_A_T_E
          </span> 
        </h1>
        <p className="mt-4 font-sans text-2xl uppercase tracking-[0.2em] text-fuchsia-400 text-center leading-loose">
           // TERMINAL_ACCESS_GRANTED // <br/> 
           <span className="text-cyan-500 text-xl block mt-2 animate-pulse">&gt; AWAITING_INPUT_</span>
        </p>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 w-full max-w-4xl flex flex-col gap-12 z-10 pb-12">
        {/* Game Section */}
        <section className="w-full flex justify-center border-l-4 border-cyan-500 pl-4 py-2 relative">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-fuchsia-500" />
          <div className="absolute -left-2 bottom-0 w-4 h-4 bg-cyan-500" />
          <SnakeGame />
        </section>

        {/* Audio Player Section */}
        <section className="w-full flex justify-center border-r-4 border-fuchsia-500 pr-4 py-2 relative mt-4">
          <div className="absolute -right-2 top-0 w-4 h-4 bg-cyan-500" />
          <div className="absolute -right-2 bottom-0 w-4 h-4 bg-fuchsia-500" />
          <MusicPlayer />
        </section>
      </main>

    </div>
  );
}
