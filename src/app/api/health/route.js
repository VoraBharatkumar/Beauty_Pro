export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mod = await import('@/lib/db');
    await mod.connectDB();
    return Response.json({ success: true, database: 'connected', connection: process.env.MONGODB_URI || 'mongodb://localhost:27017/luna-beauty' });
  } catch (error) {
    return Response.json({ success: false, database: 'disconnected', error: error.message, connection: process.env.MONGODB_URI || 'mongodb://localhost:27017/luna-beauty' }, { status: 500 });
  }
}

