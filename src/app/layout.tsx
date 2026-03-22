import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
// Proveedor del carrito de compras (Context API)
import { CartProvider } from "@/context/CartContext";
// Proveedor del tema (Claro/Oscuro)
import { ThemeProvider } from "@/context/ThemeContext";
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

// --- METADATOS DEL SITIO (Seo, Título, Descripción) ---
export const metadata: Metadata = {
  title: "Artesanías Mabe | Tienda Oficial",
  description: "Descubre las mejores artesanías hechas a mano. Tradición y calidad criolla.",
};

// --- ESTRUCTURA RAÍZ DE LA APLICACIÓN ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans bg-white dark:bg-black text-foreground transition-colors duration-300">
        {/* CartProvider envuelve a toda la app para que el carrito sea accesible desde cualquier página */}
        <ThemeProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
