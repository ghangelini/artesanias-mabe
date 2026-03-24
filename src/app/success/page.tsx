'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  // Poner acá el número real de Whatsapp del vendedor (con código de país, ej 549112345678)
  const phoneOwner = '5491169962617';
  const whatsappMessage = `¡Hola! Acabo de realizar una compra en Artesanías Mabe.%0A%0AMi ID de orden es: ${externalReference || paymentId || 'N/A'}.%0A%0ATe escribo para coordinar la entrega.`;
  const whatsappUrl = `https://wa.me/${phoneOwner}?text=${whatsappMessage}`;

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center border border-gray-100">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ¡Pago Exitoso!
      </h1>
      <p className="text-gray-500 mb-8">
        Tu pago se ha procesado correctamente. Hemos registrado tus datos de envío.
      </p>

      <div className="space-y-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold transition-all shadow-md shadow-green-200"
        >
          <MessageCircle className="w-5 h-5" />
          Coordinar Envío por WhatsApp
        </a>

        <Link
          href="/"
          className="block w-full py-4 text-amber-600 font-semibold hover:bg-amber-50 rounded-xl transition-all"
        >
          Volver a la tienda
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        ID de Transacción: {paymentId || 'No disponible'}
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
