"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, ArrowRight, Coins, Recycle, Star } from "lucide-react";
import { Mascot } from "@/components/mascot";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show popup after 1.5s delay for dramatic effect
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "🎁 Kumpulkan Poin, Tukar Hadiah!",
      desc: "Setiap kg sampah yang kamu laporkan bernilai 10 Poin. Semakin banyak lapor, semakin banyak poin!",
      highlight: "1 Kg = 10 Poin = Rp 1.000",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "💳 Tarik ke GoPay, DANA, OVO!",
      desc: "Poin bisa langsung ditukar ke saldo e-Wallet favoritmu. Minimum penarikan hanya 100 poin!",
      highlight: "100 Poin = Rp 10.000",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "🌍 Bantu Bumi, Dapat Cuan!",
      desc: "Dengan melapor sampah, kamu membantu lingkungan sekaligus mendapatkan reward. Mulai sekarang!",
      highlight: "Lapor → Poin → Saldo → Cuan!",
      color: "from-violet-500 to-purple-500",
    },
  ];

  const currentStep = steps[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-slate-900 border-2 border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/20 max-w-md w-full overflow-hidden pointer-events-auto">
              {/* Sparkle particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-400"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 200],
                      y: [0, (Math.random() - 0.5) * 200],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    style={{
                      left: `${30 + Math.random() * 40}%`,
                      top: `${20 + Math.random() * 30}%`,
                    }}
                  >
                    <Star className="w-3 h-3" fill="currentColor" />
                  </motion.div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${currentStep.color}`} />

              {/* Content */}
              <div className="p-6 pt-5">
                {/* Mascot Animation */}
                <div className="flex justify-center mb-3">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="w-28 h-28 relative">
                      <Mascot className="w-full h-full drop-shadow-2xl" />
                    </div>
                    {/* Glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <h2 className="text-xl font-bold text-white mb-2">{currentStep.title}</h2>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">{currentStep.desc}</p>

                    {/* Highlight Badge */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${currentStep.color} text-white font-bold text-sm shadow-lg`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {currentStep.highlight}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2 mt-5 mb-4">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i === step ? "bg-emerald-400 w-6" : "bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  {step < steps.length - 1 ? (
                    <>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-xl transition-colors"
                      >
                        Nanti Saja
                      </button>
                      <button
                        onClick={() => setStep(step + 1)}
                        className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                      >
                        Selanjutnya <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-xl transition-colors"
                      >
                        Tutup
                      </button>
                      <a
                        href="/dashboard/user/lapor"
                        className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <Recycle className="w-4 h-4" />
                        Lapor Sekarang!
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom decorative icons */}
              <div className="flex justify-around px-6 pb-4 text-slate-700">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                  <Recycle className="w-5 h-5" />
                </motion.div>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>
                  <Gift className="w-5 h-5" />
                </motion.div>
                <motion.div animate={{ rotate: [0, -360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                  <Coins className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
