export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  const validCoupons = {
    'LUNA10': { type: 'percentage', discount: 10, minPurchase: 999 },
    'LUNA20': { type: 'flat', discount: 500, minPurchase: 2999 },
    'FIRST50': { type: 'percentage', discount: 50, minPurchase: 1999 },
  };

  if (code && validCoupons[code]) {
    return Response.json({ success: true, coupon: { code, ...validCoupons[code] } });
  }

  return Response.json({ success: true, coupons: [] });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return Response.json({ success: true, message: 'Coupon validated', coupon: body }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

