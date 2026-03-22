// --- CONFIGURACIÓN DE MERCADO PAGO ---
// Este archivo inicializa el SDK de Mercado Pago para procesar los cobros.
// El Access Token se lee desde las variables de entorno para mayor seguridad.

import { MercadoPagoConfig, Preference } from 'mercadopago';

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// Inicialización del cliente de Mercado Pago
export const mpClient = accessToken 
  ? new MercadoPagoConfig({
      accessToken: accessToken,
      options: { timeout: 5000, idempotencyKey: 'abc' }
    })
  : (null as any);

// Exportamos la herramienta para crear "Preferencias" (el checkout de Mercado Pago)
export const preference = mpClient ? new Preference(mpClient) : (null as any);
