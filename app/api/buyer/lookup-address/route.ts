import { NextResponse } from 'next/server';
import { lookupBuyerAddress } from '@/lib/linkpe';

export async function POST(request: Request) {
  const body = await request
    .json()
    .catch(() => null);

  const phone = body?.phone?.replace(/\D/g, '').slice(-10);

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ found: false });
  }

  try {
    const response = await lookupBuyerAddress(phone);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Address lookup error:', error);
    return NextResponse.json({ found: false });
  }
}
