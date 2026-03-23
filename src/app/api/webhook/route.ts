import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// MercadoPago no tiene una SDK oficial actual que haga fetch simple por ID asique usaremos fetch normal para consultar el pago.
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || url.searchParams.get('topic');
    const dataId = url.searchParams.get('data.id') || url.searchParams.get('id');

    // Mercado Pago manda webhooks de varios tipos. Nos interesan los pagos (payment)
    if (type === 'payment' && dataId) {
      // 1. Consultar a Mercado Pago para obtener los detalles del pago real.
      // Esto previene que alguien llame al webhook falsificando un pago.
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      });

      if (!paymentResponse.ok) {
        console.error('Error al consultar pago a Mercado Pago', await paymentResponse.text());
        return NextResponse.json({ error: 'Failed to fetch payment details' }, { status: 500 });
      }

      const paymentData = await paymentResponse.json();

      // 2. Extraer la información relevante del pago
      const status = paymentData.status; // ej: 'approved', 'rejected', 'pending'
      const preferenceId = paymentData.order?.preference_id || null;
      const totalAmount = paymentData.transaction_amount;
      
      // En Mercado Pago, description o additional_info a veces trae los items, pero si preferimos 
      // buscar por preferenceId:
      const items = paymentData.additional_info?.items || [];

      // 3. Guardar o actualizar la orden en Supabase
      if (supabase) {
        // Buscamos si ya existe una orden con este preferencia (por si el cliente volvió a intentar el pago)
        const { data: existingOrders, error: fetchError } = await supabase
          .from('orders')
          .select('id')
          .eq('mp_payment_id', dataId);

        if (existingOrders && existingOrders.length > 0) {
          // Actualizar orden existente
          await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', existingOrders[0].id);
        } else {
          // Crear nueva orden
          await supabase
            .from('orders')
            .insert([{
              mp_preference_id: preferenceId,
              mp_payment_id: dataId,
              items: items,
              total_amount: totalAmount,
              status: status
            }]);
        }
      } else {
        console.warn("Supabase client is not initialized. Order was not saved.");
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
