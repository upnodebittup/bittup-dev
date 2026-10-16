/**
 * 🔐 Asaas Integration Library
 * Handles all Asaas API calls with explicit environment control (sandbox vs production)
 */
import 'server-only';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type AsaasFailure = 'configuration' | 'authentication' | 'environment' | 'permission' | 'validation' | 'rate_limit' | 'unavailable' | 'timeout' | 'network' | 'invalid_response';
// Never retain descriptions, payloads, headers or raw errors from the provider.
const diagnosticCodes = new Set([
  'invalid_environment', 'access_token_not_found', 'invalid_access_token_format',
  'invalid_access_token', 'invalid_user_agent', 'invalid_object', 'invalid_value',
  'invalid_cpfCnpj', 'invalid_cpf_cnpj', 'invalid_email', 'invalid_phone',
  'missing_api_key', 'missing_environment',
]);
export class AsaasError extends Error {
  constructor(public readonly category: AsaasFailure, public readonly status?: number,
    public readonly codes: string[] = []) {
    super(`Asaas: ${category}`);
    this.name = 'AsaasError';
  }
}

export function logAsaasFailure(operation: 'customer' | 'payment' | 'validate-key', error: unknown,
  stage = 'provider') {
  const details = error instanceof AsaasError
    ? { category: error.category, status: error.status ?? null, codes: error.codes.filter(code => diagnosticCodes.has(code)) }
    : { category: 'internal', status: null, codes: [] };
  console.error('[Asaas]', { operation, stage, ...details });
}

interface AsaasConfig {
  apiKey: string;
  baseUrl: string;
  isSandbox: boolean;
}

/**
 * Get the Asaas API key from environment variables
 */
export function getAsaasApiKey(): string {
  const key =
    process.env.ASAAS_API_KEY
  if (!key) {
    throw new AsaasError('configuration', undefined, ['missing_api_key']);
  }

  return key;
}

/**
 * Detect environment via ENV (NÃO pela chave)
 */
export function isSandboxEnvironment(): boolean {
  const env = process.env.ASAAS_ENV?.trim();

  if (!env) {
    throw new AsaasError('configuration', undefined, ['missing_environment']);
  }

  if (!['sandbox', 'production'].includes(env)) throw new AsaasError('configuration', undefined, ['invalid_environment']);
  return env === 'sandbox';
}

/**
 * Get base URL based on environment
 */
export function getAsaasBaseUrl(): string {
  const isSandbox = isSandboxEnvironment();

  return isSandbox
    ? 'https://api-sandbox.asaas.com/v3'
    : 'https://api.asaas.com/v3';
}

/**
 * Build config object
 */
export function getAsaasConfig(): AsaasConfig {
  const apiKey = getAsaasApiKey();
  const isSandbox = isSandboxEnvironment();
  const baseUrl = getAsaasBaseUrl();

  return {
    apiKey,
    baseUrl,
    isSandbox,
  };
}

/**
 * Mask API key for safe logging
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return '****';
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}

/**
 * Main fetch wrapper for Asaas API
 */
export async function asaasFetch<T = unknown>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: Record<string, unknown>,
  timeoutMs = 65_000,
): Promise<T> {
  const config = getAsaasConfig();
  const url = `${config.baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    access_token: config.apiKey,
    'Content-Type': 'application/json',
    'User-Agent': 'BittUp/1.0',
  };

  const options: RequestInit = {
    method,
    headers,
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    const text = await response.text();

    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch { /* Preserve HTTP failures even for HTML gateway responses. */ }

    if (!response.ok) {

      const errors = (data as { errors?: Array<{ code?: unknown }> } | null)?.errors;
      const codes = Array.isArray(errors) ? [...new Set(errors.map(error => error?.code)
        .filter((code): code is string => typeof code === 'string' && diagnosticCodes.has(code)))].slice(0, 8) : [];
      const category: AsaasFailure = codes.includes('invalid_environment') ? 'environment'
        : response.status === 401 ? 'authentication'
        : response.status === 403 ? 'permission'
        : response.status === 429 ? 'rate_limit'
        : [400, 422].includes(response.status) ? 'validation' : 'unavailable';
      throw new AsaasError(category, response.status, codes);
    }

    if (!data || typeof data !== 'object') throw new AsaasError('invalid_response', response.status);
    return data as T;
  } catch (error) {
    if (error instanceof AsaasError) throw error;
    const name = error instanceof Error ? error.name : '';
    throw new AsaasError(['TimeoutError', 'AbortError'].includes(name) ? 'timeout' : 'network');
  }
}

export interface CreateAsaasAccountData {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

export interface AsaasAccountResponse {
  id: string;
  walletId?: string;
}

export async function createAsaasAccount(
  account: CreateAsaasAccountData
): Promise<AsaasAccountResponse> {
  const response = await asaasFetch<AsaasAccountResponse>('/accounts', 'POST', {
    name: account.name,
    email: account.email,
    cpfCnpj: account.cpfCnpj || undefined,
    phone: account.phone || undefined,
  });

  return {
    id: response.id,
    walletId: response.walletId,
  };
}

/**
 * =========================
 * TYPES (opcional)
 * =========================
 */

export interface AsaasCustomer {
  document?: string;
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  createdAt: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  billingType: 'CREDIT_CARD' | 'PIX' | 'BOLETO';
  value: number;
  status: string;
  dueDate: string;
  externalReference?: string;
}

export interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}
