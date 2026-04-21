const SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'cookies',
  'password',
  'pass',
  'token',
  'accessToken',
  'refreshToken',
  'clientSecret',
]);

function isObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export function redactDeep(input: any): any {
  if (Array.isArray(input)) return input.map(redactDeep);
  if (!isObject(input)) return input;

  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(input)) {
    const key = k.toLowerCase();
    out[k] = SENSITIVE_KEYS.has(key) ? '[REDACTED]' : redactDeep(v);
  }
  return out;
}
