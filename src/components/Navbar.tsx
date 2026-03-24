'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f0e6d8] border-b border-[#e5d9c7] shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center pr-4">
            <img
              src="/images/logo_mabe.png"
              alt="Artesanías Mabe Logo"
              className="h-16 w-auto object-contain"
            />
            <span className="ml-3 text-2xl font-bold text-amber-900 dark:text-amber-500 tracking-tight hidden sm:block">
              Artesanías Mabe
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCartClick}
              className="relative p-2 text-amber-900 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-amber-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
