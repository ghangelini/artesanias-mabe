'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // El tiempo que el splash se queda quieto antes de empezar a subir
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // 1.5 segundos de "presencia" antes de la animación de salida

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 1, ease: [0.45, 0, 0.55, 1] } // Curva elegante para la "persiana"
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url("/shutter-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay oscuro para que el logo resalte */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

          {/* Logo animado */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="bg-white/90 p-8 rounded-full shadow-2xl backdrop-blur-md">
              <img 
                src="/icon.svg" 
                alt="Logo Artesanías Mabe" 
                className="w-32 h-32 md:w-48 md:h-48"
              />
            </div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-4xl md:text-6xl font-bold text-white drop-shadow-lg text-center font-[var(--font-outfit)]"
            >
              Artesanías Mabe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-2 text-lg text-white/90 italic drop-shadow-md"
            >
              Arte hecho con amor
            </motion.p>
          </motion.div>

          {/* Sutil textura de persiana (líneas horizontales) */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)',
              backgroundSize: '100% 4px'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
