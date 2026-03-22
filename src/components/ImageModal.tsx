'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, images, altText }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const goPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, goPrev, goNext, onClose]);

  if (!isOpen && !isAnimating) return null;

  const hasMultiple = images.length > 1;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Left Arrow */}
      {hasMultiple && (
        <button
          onClick={goPrev}
          className="absolute left-4 z-[110] p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-all active:scale-95 top-1/2 -translate-y-1/2"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Right Arrow */}
      {hasMultiple && (
        <button
          onClick={goNext}
          className="absolute right-4 z-[110] p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-all active:scale-95 top-1/2 -translate-y-1/2"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image Container */}
      <div
        className={`relative z-[105] max-w-5xl max-h-[90vh] transition-all duration-500 transform ${
          isOpen ? 'scale-100' : 'scale-90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${altText} ${hasMultiple ? `- ${currentIndex + 1}/${images.length}` : ''}`}
          className="rounded-xl shadow-2xl shadow-black/50 object-contain w-full h-full max-h-[85vh] animate-fadeIn"
        />

        {/* Caption + Dot indicators */}
        <div className="absolute -bottom-10 left-0 right-0 text-center flex flex-col items-center gap-2">
          <p className="text-white text-lg font-light tracking-wide">{altText}</p>
          {hasMultiple && (
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
