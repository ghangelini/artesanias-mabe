'use client';

import React, { Suspense } from 'react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PendingContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center border border-gray-100">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="w-10 h-10 text-amber-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Pago Pendiente
      </h1>
      <p className="text-gray-500 mb-8">
        Tu pedido está en proceso. En cuanto se acredite tu pago, comenzaremos a prepararlo. ¡Gracias por confiar en Artesanías Mabe!
      </p>

      <div className="space-y-4">
        <Link 
          href="/"
          className="block w-full py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all active:scale-[0.98]"
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

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>}>
        <PendingContent />
      </Suspense>
    </div>
  );
}
