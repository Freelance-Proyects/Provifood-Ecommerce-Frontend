/**
 * Proxy de productos: evita CORS al llamar al backend desde el navegador.
 * El cliente pide /api/products?limit=12 y el servidor reenvía al backend.
 * El backend corre en Docker local (puerto 8000) y usa Supabase como BD.
 */
import type { APIRoute } from 'astro';

const DEFAULT_API = 'http://localhost:8000/api/v1';

function getBackendBases(): string[] {
  return [import.meta.env.PUBLIC_API_BASE_URL || DEFAULT_API];
}

async function fetchFromBackend(backendUrl: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(backendUrl, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const path = `/products/${query ? `?${query}` : ''}`;
  const bases = getBackendBases();
  const timeoutMs = 15000;

  for (const base of bases) {
    const backendUrl = base.replace(/\/$/, '') + path;
    try {
      const res = await fetchFromBackend(backendUrl, timeoutMs);
      if (!res.ok) {
        if (bases.indexOf(base) < bases.length - 1) continue;
        return new Response(JSON.stringify({ error: 'Backend error' }), {
          status: res.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      });
    } catch (e) {
      console.error('[api/products]', base, e);
    }
  }

  return new Response(
    JSON.stringify({ error: 'No se pudo conectar con el servidor. En local, asegúrate de tener el backend en marcha (puerto 8000).' }),
    {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
