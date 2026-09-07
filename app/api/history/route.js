import { getUserRuns } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const runs = await getUserRuns(limit);
    return new Response(JSON.stringify({ runs }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, runs: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
