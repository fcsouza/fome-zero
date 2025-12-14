'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

export function SecuritySlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - left;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            A Diferença é a <span className="text-emerald-500">Sua Segurança</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Compare o processo tradicional de doação com a proteção jurídica do Doe Seguro.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[500px] rounded-2xl overflow-hidden cursor-col-resize shadow-2xl border border-slate-200 dark:border-slate-800"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* RIGHT SIDE (AFTER/SECURE) - Always visible, underneath */}
          <div className="absolute inset-0 bg-emerald-950 flex items-center justify-center">
            <div className="w-full h-full p-8 md:p-12 flex flex-col justify-center items-end text-right">
              <div className="max-w-md ml-auto">
                <div className="inline-flex items-center gap-2 text-emerald-400 mb-4">
                  <span className="font-bold text-xl">Com Doe Seguro</span>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Proteção Total
                </h3>
                <ul className="space-y-4 text-emerald-100">
                  <li className="flex items-center justify-end gap-3">
                    <span>Validação Jurídica Automática</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </li>
                  <li className="flex items-center justify-end gap-3">
                    <span>Certificado SHA-256</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </li>
                  <li className="flex items-center justify-end gap-3">
                    <span>Rastreabilidade Completa</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </li>
                </ul>
              </div>
            </div>
            {/* Background Pattern for Secure Side */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* LEFT SIDE (BEFORE/RISK) - Clip Path controlled by slider */}
          <div 
            className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-r border-slate-300 dark:border-slate-700"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="w-full h-full p-8 md:p-12 flex flex-col justify-center items-start text-left">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 text-rose-500 mb-4">
                  <XCircle className="h-6 w-6" />
                  <span className="font-bold text-xl">Doação Tradicional</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Alto Risco
                </h3>
                <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-rose-500" />
                    <span>Incerteza Legal (Lei 14.016)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-rose-500" />
                    <span>Sem Registro Auditável</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-rose-500" />
                    <span>Risco de Responsabilidade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* SLIDER HANDLE */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8L2 12L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
