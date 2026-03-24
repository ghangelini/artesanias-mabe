import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
// Proveedor del carrito de compras (Context API)
import { CartProvider } from "@/context/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";

// --- CONFIGURACIÓN DE FUENTES ---
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artesanías Mabe | Cerámica Artesanal y Decoración Hecha a Mano",
  description: "Tienda online de Artesanías Mabe. Descubre cuencos, mates y piezas de cerámica únicas hechas a mano con amor en Argentina. Calidad artesanal para tu hogar.",
  keywords: ["artesanías", "cerámica", "hecho a mano", "mates de cerámica", "cuencos artesanales", "decoración hogareña", "Mabe", "Argentina"],
  openGraph: {
    title: "Artesanías Mabe | Piezas Únicas de Cerámica",
    description: "Cerámica artesanal con diseños exclusivos. Envíos a todo el país.",
    url: "https://artesanias-mabe.vercel.app", // O tu dominio final
    siteName: "Artesanías Mabe",
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// --- ESTRUCTURA RAÍZ DE LA APLICACIÓN ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans bg-white text-foreground transition-colors duration-300">
        {/* CartProvider envuelve a toda la app para que el carrito sea accesible desde cualquier página */}
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
