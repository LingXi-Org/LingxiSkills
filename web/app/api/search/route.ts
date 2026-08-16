import { searchIndex } from '../../../lib/skills';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(searchIndex, {
    headers: { 'Cache-Control': 'public, max-age=3600, immutable' },
  });
}

