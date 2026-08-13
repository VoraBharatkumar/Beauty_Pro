export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mod = await import('@/lib/db');
    await mod.connectDB();
    return Response.json({ success: true, database: 'connected', connection: 'mongodb+srv://vorab.82mgrjm.mongodb.net/?appName=Vorab' });
  } catch (error) {
    return Response.json({ success: false, database: 'disconnected', error: error.message, connection: 'mongodb+srv://vorab.82mgrjm.mongodb.net/?appName=Vorab' }, { status: 500 });
  }
}

