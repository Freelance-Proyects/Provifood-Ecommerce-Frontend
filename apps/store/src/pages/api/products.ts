/**
 * Proxy de productos: evita CORS al llamar al backend desde el navegador.
 * El cliente pide /api/products?limit=12 y el servidor reenvía al backend.
 * En desarrollo, si la URL configurada falla, se intenta el backend local (puerto 8000).
 */
import type { APIRoute } from 'astro';

const DEFAULT_API = 'https://provifood-ecommerce-backend.onrender.com/api/v1';
const LOCAL_API = 'http://127.0.0.1:8000/api/v1';
const isDev = import.meta.env.DEV;

function getBackendBases(): string[] {
  const configured = import.meta.env.PUBLIC_API_BASE_URL || DEFAULT_API;
  const bases = [configured];
  if (isDev && configured !== LOCAL_API) {
    bases.push(LOCAL_API);
  }
  return bases;
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
  const path = `/products${query ? `?${query}` : ''}`;
  const bases = getBackendBases();
  const timeoutMs = isDev ? 8000 : 15000;

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
      if (isDev && bases.indexOf(base) < bases.length - 1) {
        continue;
      }
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
