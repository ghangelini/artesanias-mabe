'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/context/CartContext';
import { X, Upload, Save, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

export default function AdminProductModal({ isOpen, onClose, onSuccess, product }: Props) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    image: '',
    isFeatured: false,
    order_index: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : 0,
        stock: product.stock ? Number(product.stock) : 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        image: '',
        isFeatured: false,
        order_index: 0
      });
    }
  }, [product, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Intentar subir al bucket 'products'
      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
          throw new Error('El bucket "products" no existe en Supabase. Por favor, créalo y ponlo como público.');
        }
        throw uploadError;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err: any) {
      console.error('Error uploading:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.price || !formData.image) {
      setError('Nombre, precio e imagen son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const productToSave = {
        ...formData,
        id: product?.id || undefined, // Supabase genera ID si es undefined
        price: Number(formData.price),
        original_price: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        is_featured: formData.isFeatured,
      };

      // Limpiar campos que no van directo (compatibilidad con Supabase)
      delete (productToSave as any).originalPrice;
      delete (productToSave as any).isFeatured;

      const { error: upsertError } = await supabase
        .from('products')
        .upsert(productToSave);

      if (upsertError) throw upsertError;

      onSuccess();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Completa los datos de tu artesanía</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nombre del Producto</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                placeholder="Ej. Cuenco de Cerámica Rústico"
                required
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Stock Disponible</label>
              <input
                type="number"
                value={formData.stock}
                onChange={e => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Precio de Venta ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-bold text-amber-600"
                placeholder="0"
                required
              />
            </div>

            {/* Precio Original */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Precio Original ($ - Opcional)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={e => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm text-gray-400"
                placeholder="Para mostrar oferta"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Descripción</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm resize-none"
              placeholder="Describe los materiales, el proceso o el tamaño..."
            />
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Imagen del Producto</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center relative group">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <Upload className="w-8 h-8 text-gray-300" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs text-gray-500">Sube una foto directamente o pega una URL abajo. Se recomienda formato cuadrado (1:1).</p>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-mono text-gray-400 outline-none"
                  placeholder="URL de la imagen (o sube un archivo)"
                />
              </div>
            </div>
          </div>

          {/* Destacado */}
          <div className="flex items-center gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-amber-200"
            />
            <label htmlFor="isFeatured" className="text-sm font-bold text-amber-900 cursor-pointer">
              Marcar como Producto Destacado (aparece resaltado en la tienda)
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
