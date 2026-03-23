'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Tipo de orden
interface Order {
  id: string;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  items: any;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorFetching, setErrorFetching] = useState('');

  // Simulación de autenticación (Para producción deberías usar un login real o API protegida)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Revisa si la contraseña introducida coincide con la variable de entorno expuesta a React
    // IMPORTANTE: NEXT_PUBLIC_ADMIN_PASSWORD es visible en el lado del cliente.
    // Para mayor seguridad en el futuro, se debe validar en una API en el lado del servidor.
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'mabe2026';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setErrorLogin('');
      fetchOrders();
    } else {
      setErrorLogin('Contraseña incorrecta');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setErrorFetching('');
    try {
      if (!supabase) throw new Error("Supabase is not initialized");

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (err: any) {
      console.error(err);
      setErrorFetching('Error al cargar las ventas. Asegúrate de haber creado la tabla `orders` en Supabase.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Panel de Administrador
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 outline-none transition-all"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {errorLogin && (
              <p className="text-red-500 text-sm">{errorLogin}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Ingresar
            </button>
          </form>
          <div className="mt-4 text-xs text-center text-gray-500">
            Nota: Si no configuraste NEXT_PUBLIC_ADMIN_PASSWORD, la contraseña por defecto es "mabe2026".
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ventas Registradas
          </h1>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
          >
            Actualizar
          </button>
        </div>

        {errorFetching && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            <p>{errorFetching}</p>
            <p className="text-sm mt-2">
              Verifica el archivo <code>database_setup.md</code> generado para saber cómo crear la tabla `orders` en Supabase.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : orders.length === 0 && !errorFetching ? (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-700">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-lg">No hay ventas registradas todavía.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-zinc-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                <thead className="bg-gray-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID Pago (MP)
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Productos
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {orders.map((order) => {
                    const isApproved = order.status === 'approved';
                    const isPending = order.status === 'pending';
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {new Date(order.created_at).toLocaleString('es-AR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.mp_payment_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isApproved ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            isPending ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {Array.isArray(order.items) 
                            ? order.items.map((i: any) => `${i.quantity}x ${i.title || i.name}`).join(', ') 
                            : 'Ver detalle'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ${order.total_amount?.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
