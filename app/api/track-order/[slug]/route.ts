import { NextResponse } from 'next/server';
import { trackOrder } from '@/lib/linkpe';

export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const cleanSlug = slug?.trim();

    if (!cleanSlug) {
      return NextResponse.json(
        { error: 'order slug is required' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    const phone = body?.phoneNumber?.trim();

    if (!phone) {
      return NextResponse.json(
        { error: 'phone number is required' },
        { status: 400 }
      );
    }

    const response = await trackOrder(cleanSlug, phone);

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to track order' },
      { status: 500 }
    );
  }
}
