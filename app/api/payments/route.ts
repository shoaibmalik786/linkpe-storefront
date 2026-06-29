import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/linkpe';

export async function POST(
  request: Request
) {
  const body = await request
    .json()
    .catch(() => null);

  if (!body?.checkout) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid checkout payload',
      },
      { status: 400 }
    );
  }

  try {
    const response = await createOrder(
      body.checkout,
      body.idempotencyKey
    );

    return NextResponse.json({
      success: true,
      checkout: response,
      razorpay: response.session.razorpay_order_id
        ? {
            key: response.session.razorpay_key_id,
            amount: Math.round(response.total * 100),
            currency: response.currency,
            orderId: response.session.razorpay_order_id,
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to initialize payment',
      },
      { status: error?.status || 500 }
    );
  }
}
