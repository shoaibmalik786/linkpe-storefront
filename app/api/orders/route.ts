import { NextResponse } from 'next/server';
import { verifyOrderPayment } from '@/lib/linkpe';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request
) {
  const body = await request
    .json()
    .catch(() => null);

  if (!body) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
      },
      { status: 400 }
    );
  }

  const {
    order_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = body;

  if (!order_id) {
    return NextResponse.json(
      {
        success: false,
        error:
          'order id is required',
      },
      { status: 400 }
    );
  }

  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Payment verification failed',
      },
      { status: 400 }
    );
  }

  try {
    const response =
      await verifyOrderPayment({
        order_id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });

    return NextResponse.json({
      success: true,
      order: {
        id: response.order_id,
        status: response.status,
      },
      payment_id: response.payment_id,
      already_paid: response.already_paid,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Payment verification failed',
      },
      { status: error?.status || 500 }
    );
  }
}
