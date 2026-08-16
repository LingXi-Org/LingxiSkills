import { searchDatabase } from '../../../lib/skills';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(searchDatabase, {
    headers: { 'Cache-Control': 'public, max-age=3600, immutable' },
  });
}
