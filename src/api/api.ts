// Único ponto do app que fala com o backend (seção 2.2 do plano).
// Esqueleto da FND-01: a forma de chamar é a final. A FND-05 acrescenta o token,
// o tempo limite, a classe ErroApi, a falha de rede e o aviso de 401 à sessão.

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não definida. Copie .env.example para .env.');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} em ${method} ${path}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T = void>(path: string) => request<T>('DELETE', path),
};
