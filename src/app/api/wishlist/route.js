export const dynamic = 'force-dynamic';

export async function GET(request) {
  return Response.json({ success: true, items: [] });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return Response.json({ success: true, message: 'Added to wishlist', item: body }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    return Response.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

