export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  return Response.json({ success: true, reviews: [] });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return Response.json({ success: true, message: 'Review submitted', review: body }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

