'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Check, ShieldCheck, AlertTriangle, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function InteractiveHero() {
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Mouse position for desktop spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      className="relative min-h-[90vh] overflow-hidden bg-slate-950 text-white flex items-center justify-center pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Background Grid - Static */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left: Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 backdrop-blur-sm mb-6">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Lei 14.016/2020 Compliance</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
                Sua <span className="text-emerald-500">Blindagem Jurídica</span> contra o Desperdício.
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl">
                Não doe apenas com boa intenção. Doe com imunidade jurídica. 
                Nossa IA valida cada item para garantir conformidade total com a legislação sanitária.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/signup/doador">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto h-12 px-8 text-base">
                  Doar com Proteção
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 text-slate-300 w-full sm:w-auto h-12 px-8 text-base">
                  Ver a Tecnologia
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Interactive Reveal (Mobile Drag / Desktop Hover) */}
          <div className="relative h-[400px] w-full max-w-[500px] mx-auto lg:h-[500px]">
            
            {/* The "Safe" Layer (Bottom) */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-6 flex flex-col justify-between overflow-hidden">
               <div className="absolute inset-0 bg-emerald-500/5 blur-3xl" />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                     <Check className="h-5 w-5 text-white" />
                   </div>
                   <span className="font-semibold text-emerald-400">Doação Aprovada</span>
                 </div>
                 <div className="space-y-2">
                   <div className="h-2 w-24 bg-emerald-500/20 rounded-full" />
                   <div className="h-2 w-full bg-emerald-500/20 rounded-full" />
                   <div className="h-2 w-3/4 bg-emerald-500/20 rounded-full" />
                 </div>
               </div>

               <div className="relative z-10 bg-emerald-900/40 p-4 rounded-xl border border-emerald-500/20">
                 <p className="text-sm text-emerald-200">
                   "Certificado Digital emitido. Sua empresa está isenta de responsabilidade civil e criminal conforme Lei 14.016."
                 </p>
               </div>
            </div>

            {/* The "Risk" Layer (Top - Draggable/Masked) */}
            <RiskLayer isRevealed={isRevealed} setIsRevealed={setIsRevealed} />

          </div>
        </div>
      </div>
    </section>
  );
}

function RiskLayer({ isRevealed, setIsRevealed }: { isRevealed: boolean, setIsRevealed: (v: boolean) => void }) {
  // Mobile Drag Logic
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 150], [1, 0]);
  
  function handleDragEnd(event: any, info: any) {
    if (info.offset.y > 100) {
      setIsRevealed(true);
    } else {
      // Reset if not dragged enough
    }
  }

  // If revealed, we hide this layer mostly, or move it away
  if (isRevealed) {
    return (
      <motion.div 
        initial={{ opacity: 1 }} 
        animate={{ opacity: 0, pointerEvents: 'none' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Button 
          variant="outline" 
          onClick={() => setIsRevealed(false)}
          className="bg-slate-900 text-white border-slate-700"
        >
          Reset
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ y, opacity }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 200 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 rounded-2xl bg-slate-800 border border-slate-700 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-2xl z-20"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="h-6 w-6" />
          <span className="font-semibold text-lg">Risco Jurídico Detectado</span>
        </div>
        <p className="text-slate-400">
          Sem validação técnica, sua doação pode gerar processos e multas. A incerteza é o maior custo.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 text-slate-500">
        <span className="text-sm font-medium">Arraste para desbloquear segurança</span>
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </div>
    </motion.div>
  );
}
