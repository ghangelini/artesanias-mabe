import { NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';
import { CartItem } from '@/context/CartContext';

export async function POST(req: Request) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
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
      // external_reference puede usarse en un futuro si decidimos crear la orden *antes* de enviarlos a MP.
      // Así mercado pago nos devuelve este ID en el webhook.
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
