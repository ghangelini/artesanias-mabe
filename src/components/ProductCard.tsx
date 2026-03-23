'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import ImageModal from './ImageModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Build the full images array (primary + extras)
  const allImages = product.images && product.images.length > 0
    ? [product.image, ...product.images]
    : [product.image];

  // Show second image on hover (if available)
  const displayImage = isHovered && allImages.length > 1 ? allImages[1] : allImages[0];

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <div
        className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

        {/* Dot indicators for multiple images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {allImages.map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  (isHovered ? 1 : 0) === i
                    ? 'bg-white scale-125'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg overflow-hidden">
              DESTACADO
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg overflow-hidden">
              OFERTA
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col h-[180px]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description || 'Artesanía hecha a mano con dedicación.'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                ${product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
            <span className="text-xl font-bold text-amber-900 dark:text-amber-500">
              ${product.price.toLocaleString('es-AR')}
            </span>
          </div>
          {product.stock !== undefined && product.stock <= 0 ? (
            <a
              href={`https://wa.me/5491169962617?text=${encodeURIComponent(`Hola Mabe! Quería saber si vas a reponer stock de: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 h-10 rounded-[14px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all shadow-sm text-xs font-bold leading-tight text-center"
            >
              Consultar stock
            </a>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-all active:scale-95 shadow-lg shadow-amber-200"
              aria-label="Agregar al carrito"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Lightbox / Image Zoom Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={allImages}
        altText={product.name}
      />
    </div>
  );
};

export default ProductCard;
