'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import { ShoppingBag, Star } from 'lucide-react';

// --- DATOS DE PRODUCTOS (MOCK/LOCAL) ---
// Modifica este listado para cambiar los productos, precios e imágenes que se ven en la web.
const getDefaultProducts = (): Product[] => [
  {
    id: '1',
    name: 'Set 4 Cuencos de Ceramica + Tabla de picada',
    price: 66000,
    originalPrice: 77000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/captura-de-pantalla-2026-03-21-172221-06037bd05bf9d22b7617741245976576-480-0.webp',
    images: ['/images/products/set_cuencos_tabla_2.jpg'],
    stock: 10,
    isFeatured: true,
    description: 'Set 4 Cuencos de Ceramica + Tabla de picada - Diseños únicos y personalizados.',
  },
  {
    id: '2',
    name: 'Mates Artesanales - Ceramica (Gatitos)',
    price: 17999,
    originalPrice: 20000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/img_1624-4a903e158e6eeef90717741239902642-480-0.webp',
    stock: 5,
    description: 'Mates de cerámica con diseños de gatitos pintados a mano. Piezas únicas.',
  },
  {
    id: '3',
    name: 'Bandeja en cerámica - Libélulas',
    price: 22000,
    image: '/images/products/bandeja_libelula.jpg',
    stock: 2,
    description: 'Hermosa bandeja de cerámica con diseño de libélulas. Consultar disponibilidad por WhatsApp.',
  },
  {
    id: '4',
    name: 'Plato Corazón',
    price: 15000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/plato-corazon-1124c7cad44c09ea2b17472527169459-480-0.webp',
    stock: 4,
    description: 'Plato artesanal en forma de corazón. Ideal para regalo.',
  },
  {
    id: '5',
    name: 'Bandeja Esgrafiada',
    price: 32000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/bandeja-esgrafiada-4e11c4a4855adabe7117472525936963-480-0.webp',
    stock: 3,
    description: 'Bandeja con técnica de esgrafiado, diseño exclusivo y detallado.',
  },
  {
    id: '6',
    name: 'Cucharitas en Cerámica',
    price: 2500,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/whatsapp-image-2025-05-14-at-3-05-58-pm-07bfe84917d9b39f4417472524194943-480-0.webp',
    stock: 20,
    description: 'Cucharitas artesanales de cerámica decoradas a mano.',
  },
  {
    id: '7',
    name: 'Porta Sahumerio',
    price: 9500,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/whatsapp-image-2025-05-14-at-3-06-56-pm-079f0d601395675f0217472523807101-480-0.webp',
    stock: 15,
    description: 'Porta sahumerio decorativo, disponible en varios diseños.',
  },
  {
    id: '8',
    name: 'Porta Saquito',
    price: 4000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/whatsapp-image-2025-05-14-at-3-08-15-pm-de53b8d7e5f7b30d2717472523348237-480-0.webp',
    stock: 12,
    description: 'Práctico porta saquito de té de cerámica pintado a mano.',
  },
  {
    id: '9',
    name: 'Vasija Ovillera',
    price: 42000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/whatsapp-image-2025-05-14-at-3-13-36-pm-d7f18211033a82a02617472522847255-480-0.webp',
    stock: 5,
    description: 'Vasija diseñada especialmente para ovillar lana sin enredos.',
  },
  {
    id: '10',
    name: 'Set de 3 Cuencos en Cerámica',
    price: 25000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/3-cuencos-x-20-2d355a924a3ad2c52e17472480013245-480-0.webp',
    stock: 6,
    description: 'Juego de tres cuencos de diferentes tamaños coordinados.',
  },
  {
    id: '11',
    name: 'Cuencos Rústicos en Cerámica',
    price: 9000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/cuencos-rusticos-x-10-76daaaa20867798d2517472434318167-480-0.webp',
    stock: 18,
    description: 'Cuencos individuales con terminación rústica y artesanal.',
  },
  {
    id: '12',
    name: 'Collares en Cerámica',
    price: 3500,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/captura-de-pantalla-2025-05-14-142006-2be0a424c883fb807417472432381255-480-0.webp',
    stock: 25,
    description: 'Accesorios únicos: collares con dijes modelados y pintados a mano.',
  },
  {
    id: '13',
    name: 'Porta Vela',
    price: 14800,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/hornitos-852841f484aa10e05617472428345087-480-0.webp',
    stock: 10,
    description: 'Porta vela artesanal para crear ambientes cálidos.',
  },
  {
    id: '14',
    name: 'Porta Espiral',
    price: 3000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/whatsapp-image-2025-05-14-at-2-11-19-pm-27e10003208e3a24eb17472427444110-480-0.webp',
    stock: 8,
    description: 'Porta espiral decorativo y funcional para el hogar o jardín.',
  },
  {
    id: '15',
    name: 'Juego de Plato + Taza',
    price: 26000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/plato-y-taza-b81af14319ce295d7317472426971176-480-0.webp',
    stock: 4,
    description: 'Set coordinado de plato y taza con diseños botánicos.',
  },
  {
    id: '16',
    name: 'Saleros en Cerámica',
    price: 5500,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/saleros-4e8eb1d2c86057533b17472424958338-480-0.webp',
    stock: 30,
    description: 'Saleros artesanales para poner un toque de arte en tu mesa.',
  },
  {
    id: '17',
    name: 'Panera Rústica',
    price: 18500,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/whatsapp-image-2025-05-14-at-3-03-38-pm-bb2f0826aaa38b94b017472478003946-480-0.webp',
    stock: 3,
    description: 'Panera de cerámica con estilo rústico y natural.',
  },
  {
    id: '18',
    name: 'Mates Artesanales - Personalizados',
    price: 17999,
    originalPrice: 20000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/mates-c23eb556a4a124f23f17472421887872-480-0.webp',
    stock: 10,
    description: 'Mates de cerámica personalizados. Contanos tu idea.',
  },
  {
    id: '19',
    name: 'Plato Desayuno',
    price: 14000,
    image: 'https://dcdn-us.mitiendanube.com/stores/006/219/336/products/tostadas-a098c6e8dcd282149217471812783729-480-0.webp',
    stock: 7,
    description: 'Plato ideal para desayunos o meriendas con estilo artesanal.',
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- EFECTO PARA CARGAR PRODUCTOS ---
  useEffect(() => {
    async function fetchProducts() {
      // Actualmente usa datos locales. Para usar la base de datos de Supabase, 
      // deberías descomentar la lógica de supabase y filtrar/mapear los resultados.
      setProducts(getDefaultProducts());
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf6] dark:bg-gray-950 pb-20 transition-colors duration-300">
      {/* Barra de navegación superior */}
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      {/* Sidebar lateral del carrito (se abre al hacer clic en el icono) */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* --- GRILLA DE PRODUCTOS --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
          {/* Título de la sección de productos */}
          <div className="flex items-center gap-3 mb-10">
            <ShoppingBag className="w-8 h-8 text-amber-600 dark:text-amber-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Nuestros Productos</h2>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800 ml-4 hidden md:block" />
          </div>

          {/* Renderizado Condicional: Mientras carga muestra esqueletos (pulse), luego los productos Real */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- PIE DE PÁGINA (FOOTER) --- */}
      <footer className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">© 2026 Artesanías Mabe. Hecho con pasión.</p>
      </footer>
    </div>
  );
}
