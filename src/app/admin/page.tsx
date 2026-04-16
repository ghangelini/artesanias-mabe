'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

import AdminProductList from '@/components/AdminProductList';

// Tipo de orden
interface Order {
  id: string;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  items: any;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorFetching, setErrorFetching] = useState('');

  // Simulación de autenticación
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ElenaMabel2026';
    
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

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error Supabase:', err);
      setErrorFetching(`Error: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-amber-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
            <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Administrativa
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 text-gray-900 outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {errorLogin && (
              <p className="text-red-500 text-sm font-medium text-center">{errorLogin}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all transform hover:-translate-y-0.5"
            >
              Ingresar al Panel
            </button>
          </form>
          <div className="mt-6 text-xs text-center text-gray-400">
            Artesanías Mabe © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Panel Administrativo
            </h1>
            <p className="text-gray-500 font-medium">Gestiona tu tienda y revisa tus ventas</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'orders' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Ventas
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'products' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Productos
            </button>
          </div>
        </div>

        {activeTab === 'orders' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Ventas Registradas</h2>
              <button 
                onClick={fetchOrders}
                className="px-4 py-2 bg-white text-amber-600 border border-amber-200 font-semibold rounded-lg shadow-sm hover:bg-amber-50 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>

            {errorFetching && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 shadow-sm">
                <p className="font-semibold">Ocurrió un error</p>
                <p className="text-sm">{errorFetching}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : orders.length === 0 && !errorFetching ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center text-gray-500 border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Aún no hay ventas registradas</p>
                <p className="text-sm mt-1">Los pedidos aparecerán aquí cuando los clientes completen sus compras.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Productos</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => {
                        const isApproved = order.status === 'approved';
                        const isPending = order.status === 'pending';
                        
                        return (
                          <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                              {new Date(order.created_at).toLocaleString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              {order.customer_name ? (
                                <div>
                                  <p className="font-bold text-gray-900">{order.customer_name}</p>
                                  <p className="text-xs text-gray-500">{order.customer_email}</p>
                                  <p className="text-[10px] text-gray-400">{order.customer_phone}</p>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400 italic">Sin datos registrados</span>
                              )}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-[10px] font-bold rounded-full uppercase tracking-wider ${
                                isApproved ? 'bg-green-100 text-green-700' :
                                isPending ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {order.status === 'approved' ? 'Aprobado' : order.status === 'pending' ? 'Pendiente' : 'Fallido'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-600 max-w-xs">
                              <p className="truncate font-medium">
                                {Array.isArray(order.items) 
                                  ? order.items.map((i: any) => `${i.quantity}x ${i.title || i.name}`).join(', ') 
                                  : 'Ver detalle'}
                              </p>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
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
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 min-h-[400px]">
            <AdminProductList />
          </div>
        )}
      </div>
    </div>
  );
}
