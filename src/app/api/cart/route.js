export const dynamic = 'force-dynamic';

export async function GET(request) {
  return Response.json({ success: true, items: [], subtotal: 0, total: 0 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return Response.json({ success: true, message: 'Item added to cart', item: body }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  return Response.json({ success: true, message: 'Cart cleared' });
}

