import type { APIRoute } from 'astro';
import path from 'node:path';
import { generateGraphData } from '../../scripts/generate-graph.js';

export const GET: APIRoute = async () => {
  const siteDir = path.resolve(process.cwd());
  const vaultRoot = path.resolve(siteDir, '..');
  
  const data = generateGraphData(vaultRoot);
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};
