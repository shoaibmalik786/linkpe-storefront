import { NextResponse } from 'next/server';
import { trackOrders } from '@/lib/linkpe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phoneNumber = body?.phoneNumber?.trim();

  if (!phoneNumber) {
    return NextResponse.json(
      { error: 'phone number is required' },
      { status: 400 }
    );
  }

  const response = await trackOrders(phoneNumber);

  return NextResponse.json(response);
}
