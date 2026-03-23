'use client';

import React, { Suspense } from 'react';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

function FailureContent() {
  return (
    <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-3xl shadow-xl overflow-hidden p-8 text-center border border-gray-100 dark:border-zinc-700">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-red-600 dark:text-red-500" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Pago Rechazado
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Lo sentimos, no pudimos procesar tu pago. Por favor, intenta nuevamente con otro medio de pago.
      </p>

      <div className="space-y-4">
        <Link 
          href="/"
          className="block w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-[0.98]"
        >
          Volver a intentar
        </Link>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4 py-12">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>}>
        <FailureContent />
      </Suspense>
    </div>
  );
}
