'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/context/CartContext';
import { X, Upload, Save, Loader2, AlertCircle, Trash2, Star, Image as ImageIcon } from 'lucide-react';

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
    images: [],
    isFeatured: false,
    order_index: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : 0,
        stock: product.stock ? Number(product.stock) : 0,
        images: product.images || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        image: '',
        images: [],
        isFeatured: false,
        order_index: 0
      });
    }
  }, [product, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const newUrls = await Promise.all(uploadPromises);

      setFormData(prev => {
        // Si no hay imagen principal, la primera de las nuevas lo será
        if (!prev.image && newUrls.length > 0) {
          return {
            ...prev,
            image: newUrls[0],
            images: [...(prev.images || []), ...newUrls.slice(1)]
          };
        }
        // Si ya hay, las agregamos a la galería de extras
        return {
          ...prev,
          images: [...(prev.images || []), ...newUrls]
        };
      });
    } catch (err: any) {
      console.error('Error uploading:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setFormData(prev => {
      if (prev.image === url) {
        // Si borramos la principal, la primera de las extras toma su lugar
        const nextImage = prev.images && prev.images.length > 0 ? prev.images[0] : '';
        const nextImages = prev.images ? prev.images.slice(1) : [];
        return { ...prev, image: nextImage, images: nextImages };
      }
      return {
        ...prev,
        images: prev.images?.filter(img => img !== url)
      };
    });
  };

  const setAsPrimary = (url: string) => {
    setFormData(prev => {
      if (prev.image === url) return prev;
      
      const currentPrimary = prev.image;
      const otherImages = prev.images?.filter(img => img !== url) || [];
      
      return {
        ...prev,
        image: url,
        images: currentPrimary ? [currentPrimary, ...otherImages] : otherImages
      };
    });
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
          id: product?.id || undefined,
          price: Number(formData.price),
          original_price: formData.originalPrice ? Number(formData.originalPrice) : null,
          stock: Number(formData.stock),
          is_featured: formData.isFeatured,
          images: formData.images || []
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
                   {/* Imágenes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Galería de Imágenes</label>
              <div className="relative">
                <button
                  type="button"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 transition-colors flex items-center gap-2"
                >
                  <Upload size={14} />
                  Subir fotos
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Imagen Principal */}
              {formData.image && (
                <div className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md">
                  <img src={formData.image} alt="Principal" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 block px-2 py-0.5 bg-amber-500 text-[9px] font-bold text-white rounded-full">PRINCIPAL</div>
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform">
                    <button
                      type="button"
                      onClick={() => removeImage(formData.image!)}
                      className="text-white hover:text-red-400 p-1"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Imágenes Secundarias */}
              {formData.images?.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-all">
                  <img src={url} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAsPrimary(url)}
                      className="text-white hover:text-amber-400 p-1.5 bg-white/10 rounded-full hover:bg-white/20"
                      title="Hacer Principal"
                    >
                      <Star size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="text-white hover:text-red-400 p-1.5 bg-white/10 rounded-full hover:bg-white/20"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Skeleton/Placeholder de subida */}
              {uploading && (
                <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                </div>
              )}

              {(!formData.image && !uploading) && (
                <div className="col-span-2 sm:col-span-1 aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-4">
                  <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                  <span className="text-[10px] text-gray-400 text-center font-medium">No hay imágenes. Sube al menos una.</span>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-gray-400 italic">
              * La primera imagen aparecerá como portada. Puedes elegir varias a la vez. Marcar con estrella ★ para cambiar la portada.
            </p>
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
