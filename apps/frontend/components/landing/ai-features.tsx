'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ScanLine, Smartphone, MousePointer2, ClipboardList, FileText, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export function AIFeatures() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScanStart = () => {
    setIsScanning(true);
    setScanComplete(false);
    // Simulate scan duration
    setTimeout(() => {
      setScanComplete(true);
      setIsScanning(false);
    }, 2000);
  };

  const handleScanEnd = () => {
    if (!scanComplete) {
      setIsScanning(false);
    }
  };

  return (
    <section id="funcionalidades" className="bg-white dark:bg-slate-950 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto space-y-32 px-4">
        
        {/* Feature 1: Interactive Visual Validation */}
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
              <ScanLine className="h-4 w-4" />
              <span>IA: Visão Computacional</span>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Auditoria Visual <br/>
              <span className="text-emerald-500">em Tempo Real</span>
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Nossa IA analisa micro-texturas e padrões visuais para identificar riscos que o olho humano pode perder. 
              Segure para escanear ou passe o mouse para ver a análise técnica.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Mobile</p>
                  <p className="text-sm text-slate-500">Pressione e segure para escanear</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <MousePointer2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Desktop</p>
                  <p className="text-sm text-slate-500">Passe o mouse para revelar dados</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group perspective-1000">
             {/* Interactive Image Container */}
             <div 
               className="relative mx-auto max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-800"
               onMouseEnter={() => setIsScanning(true)}
               onMouseLeave={() => { setIsScanning(false); setScanComplete(false); }}
               onTouchStart={handleScanStart}
               onTouchEnd={handleScanEnd}
             >
               <Image
                 src="/foto-ai.png"
                 alt="Validação Visual"
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />

               {/* Overlay: Scanning UI */}
               <AnimatePresence>
                 {(isScanning || scanComplete) && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px]"
                   >
                     {/* Scanning Line */}
                     {!scanComplete && (
                       <motion.div 
                         className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-20"
                         animate={{ top: ['0%', '100%', '0%'] }}
                         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                       />
                     )}

                     {/* Bounding Boxes (Revealed on Complete or Hover) */}
                     <div className="absolute inset-0 p-8">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute top-[30%] left-[20%] w-[60%] h-[40%] border-2 border-emerald-400 rounded-lg bg-emerald-400/10 flex items-start justify-between p-2"
                        >
                          <div className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                            FRESH: 98%
                          </div>
                        </motion.div>

                        {scanComplete && (
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg border border-emerald-500/30"
                          >
                             <div className="flex items-center gap-3 mb-2">
                               <div className="bg-emerald-500 rounded-full p-1">
                                 <Check className="h-4 w-4 text-white" />
                               </div>
                               <span className="font-bold text-emerald-600 dark:text-emerald-400">Aprovado</span>
                             </div>
                             <p className="text-xs text-slate-500">
                               Embalagem íntegra. Coloração adequada. Sem sinais de oxidação.
                             </p>
                          </motion.div>
                        )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Hint Overlay (When not interacting) */}
               {!isScanning && !scanComplete && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium animate-pulse">
                     Scan me
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Feature 2 & 3 Combined: Logic & Law */}
        <div className="grid gap-12 md:grid-cols-3">
           <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-none">
             <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                   <ClipboardList className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Checklist Dinâmico</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Esqueça formulários de papel. Nossa IA gera o checklist exato para cada tipo de alimento (lácteos, hortifruti, enlatados) garantindo conformidade total.
                </p>
             </CardContent>
           </Card>

           <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-none">
             <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                   <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Certificado Jurídico</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Geração automática de certificados com hash SHA-256 e assinatura digital. Sua prova irrefutável de boa-fé e conformidade com a Lei 14.016.
                </p>
             </CardContent>
           </Card>

           <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-none">
             <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                   <MessageCircle className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Suporte 24/7</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Dúvidas sobre armazenamento? Nosso assistente IA responde instantaneamente sobre normas da ANVISA e boas práticas de conservação.
                </p>
             </CardContent>
           </Card>
        </div>

      </div>
    </section>
  );
}
