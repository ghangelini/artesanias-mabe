import { NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';
import { CartItem } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json() as { items: CartItem[], customer: any };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }
    
    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json({ error: 'Faltan datos del cliente' }, { status: 400 });
    }

    let orderId = null;
    
    // Calcular el total
    const totalAmount = items.reduce((acc, current) => acc + (Number(current.price) * Number(current.quantity)), 0);

    // Guardamos la orden en Supabase ANTES de llevarlo a Mercado Pago
    // Estará en estado "pending"
    if (supabase) {
      const { data: newOrder, error: dbError } = await supabase
        .from('orders')
        .insert([{
          items: items,
          total_amount: totalAmount,
          status: 'pending',
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          shipping_address: customer.address
        }])
        .select('id')
        .single();
        
      if (!dbError && newOrder) {
        orderId = newOrder.id;
      }
    }

    const body = {
      items: items.map((item) => ({
        id: item.id,
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        currency_id: 'ARS',
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success`,
        failure: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/failure`,
        pending: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pending`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_URL || 'https://tu-dominio.com'}/api/webhook`,
      external_reference: orderId ? orderId : undefined,
    };

    const response = await preference.create({ body });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error: any) {
    console.error('Mercado Pago Error Detail:', JSON.stringify(error, null, 2));
    const errorMessage = error?.message || 'Error al crear la preferencia de pago';
    return NextResponse.json({ 
      error: errorMessage,
      details: error?.cause || error
    }, { status: 500 });
  }
}
