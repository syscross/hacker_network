import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { WORLD_COASTLINES, WORLD_BORDERS } from './worldMapData';

registerSW({ immediate: true });

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface ModelOption {
  id: string;
  label: string;
  tier: string;
}

interface ProviderInfo {
  id: 'google' | 'openrouter' | 'anthropic' | 'openai' | 'xai' | 'deepseek';
  name: string;
  keyPlaceholder: string;
  note: string;
  models: ModelOption[];
}

const AI_PROVIDERS: ProviderInfo[] = [
  {
    id: 'google',
    name: 'Google Gemini (Free Tier 권장)',
    keyPlaceholder: 'AIzaSy...',
    note: 'Google AI Studio',
    models: [
      { id: 'gemini-flash-lite-latest', label: 'Flash Lite Latest (권장)', tier: 'Free Tier' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', tier: 'Flash Lite' },
      { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', tier: 'Flash Lite' },
      { id: 'gemini-flash-latest', label: 'Flash Latest', tier: 'Flash' },
      { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', tier: 'Flash' },
      { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash', tier: 'Flash' },
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', tier: 'Flash' },
      { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', tier: 'Flash' },
      { id: 'gemini-4-argon', label: 'Gemini 4 Argon', tier: 'Pro' },
      { id: 'gemini-3-pro-preview', label: 'Gemini 3 Pro Preview', tier: 'Preview' },
      { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', tier: 'Legacy' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', tier: 'Legacy' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', tier: 'Legacy' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    keyPlaceholder: 'sk-or-v1-...',
    note: 'OpenRouter API (모든 모델 호환)',
    models: [
      { id: 'openrouter/auto', label: 'OpenRouter Auto', tier: 'Auto' },
      { id: 'anthropic/claude-haiku-5.5', label: 'Claude Haiku 5.5', tier: 'Fast' },
      { id: 'anthropic/claude-sonnet-5.5', label: 'Claude Sonnet 5.5', tier: 'Balanced' },
      { id: 'anthropic/claude-opus-5.5', label: 'Claude Opus 5.5', tier: 'Flagship' },
      { id: 'google/gemini-3.8-flash', label: 'Gemini 3.8 Flash', tier: 'Fast' },
      { id: 'google/gemini-4-argon', label: 'Gemini 4 Argon', tier: 'Pro' },
      { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', tier: 'Fast' },
      { id: 'openai/gpt-6.1-sol', label: 'GPT-6.1 Sol', tier: 'Fast Coding' },
      { id: 'openai/gpt-6-astra', label: 'GPT-6 Astra', tier: 'Flagship' },
      { id: 'deepseek/deepseek-v4.1-flash', label: 'DeepSeek-V4.1 Flash', tier: 'Fast' },
      { id: 'deepseek/deepseek-v4-pro', label: 'DeepSeek-V4 Pro', tier: 'Flagship' },
      { id: 'x-ai/grok-4.7', label: 'Grok 4.7', tier: 'Flagship' },
      { id: 'deepseek/deepseek-chat-v3-0324:free', label: 'DeepSeek V3 (Free)', tier: 'Free' },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)', tier: 'Free' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    keyPlaceholder: 'sk-ant-...',
    note: 'Anthropic Console (버전 구분에 하이픈 사용)',
    models: [
      { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', tier: 'Fast' },
      { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', tier: 'Balanced' },
      { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', tier: 'Flagship' },
      { id: 'claude-fable-5-1', label: 'Claude Fable 5.1', tier: 'Reasoning' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', tier: 'Balanced' },
      { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', tier: 'Flagship' },
      { id: 'claude-opus-4-6', label: 'Claude Opus 4.6', tier: 'Flagship' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', tier: 'Fast' },
      { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', tier: 'Balanced' },
      { id: 'claude-opus-4-1', label: 'Claude Opus 4.1', tier: 'Flagship' },
      { id: 'claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet (Latest)', tier: 'Legacy' },
      { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku (Latest)', tier: 'Legacy' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    keyPlaceholder: 'sk-proj-...',
    note: 'OpenAI Platform',
    models: [
      { id: 'gpt-6-astra', label: 'GPT-6 Astra', tier: 'Flagship' },
      { id: 'gpt-6.1-sol', label: 'GPT-6.1 Sol', tier: 'Fast Coding' },
      { id: 'gpt-6.1-terra', label: 'GPT-6.1 Terra', tier: 'Lightweight' },
      { id: 'gpt-6-luna', label: 'GPT-6 Luna', tier: 'High-Volume' },
      { id: 'gpt-6-cyber', label: 'GPT-6 Cyber', tier: 'Security' },
      { id: 'gpt-5.6-sol', label: 'GPT-5.6 Sol', tier: 'Balanced' },
      { id: 'gpt-5.6-terra', label: 'GPT-5.6 Terra', tier: 'Mid-tier' },
      { id: 'gpt-5.6-luna', label: 'GPT-5.6 Luna', tier: 'Fast' },
      { id: 'gpt-5.5', label: 'GPT-5.5', tier: 'Standard' },
      { id: 'o3-pro', label: 'o3-pro', tier: 'Reasoning' },
      { id: 'o3', label: 'o3', tier: 'Reasoning' },
      { id: 'o4-mini', label: 'o4-mini', tier: 'Reasoning' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', tier: 'Legacy Fast' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', tier: 'Legacy' },
    ],
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    keyPlaceholder: 'xai-...',
    note: 'xAI Console',
    models: [
      { id: 'grok-4.7', label: 'Grok 4.7', tier: 'Flagship' },
      { id: 'grok-4.6', label: 'Grok 4.6', tier: 'Standard' },
      { id: 'grok-420-reasoning', label: 'Grok 420 Reasoning', tier: 'Reasoning' },
      { id: 'latest', label: 'Grok Latest (Rolling)', tier: 'Auto' },
      { id: 'grok-3', label: 'Grok 3', tier: 'Legacy' },
      { id: 'grok-3-mini', label: 'Grok 3 Mini', tier: 'Legacy Fast' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    keyPlaceholder: 'sk-...',
    note: 'DeepSeek Platform',
    models: [
      { id: 'deepseek-flash', label: 'DeepSeek Flash (Default)', tier: 'Fast' },
      { id: 'deepseek-v4.1-flash', label: 'DeepSeek-V4.1 Flash', tier: 'Fast' },
      { id: 'deepseek-v4-flash', label: 'DeepSeek-V4 Flash', tier: 'Fast' },
      { id: 'deepseek-v4-pro', label: 'DeepSeek-V4 Pro', tier: 'Flagship' },
      { id: 'deepseek-chat', label: 'DeepSeek Chat (Legacy)', tier: 'Legacy' },
      { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (Legacy)', tier: 'Legacy' },
    ],
  },
];

const ANTHROPIC_DOT_TO_HYPHEN_MAP: Record<string, string> = {
  'claude-sonnet-5.5': 'claude-sonnet-5-5',
  'claude-haiku-5.5': 'claude-haiku-5-5',
  'claude-opus-5.5': 'claude-opus-5-5',
  'claude-fable-5.1': 'claude-fable-5-1',
  'claude-opus-4.8': 'claude-opus-4-8',
  'claude-opus-4.6': 'claude-opus-4-6',
  'claude-sonnet-4.5': 'claude-sonnet-4-5',
  'claude-haiku-4.5': 'claude-haiku-4-5',
  'claude-opus-4.1': 'claude-opus-4-1',
};

function normalizeProviderModelId(providerId: ProviderInfo['id'], modelId: string): string {
  const trimmed = modelId.trim();
  if (providerId === 'anthropic' && ANTHROPIC_DOT_TO_HYPHEN_MAP[trimmed]) {
    return ANTHROPIC_DOT_TO_HYPHEN_MAP[trimmed];
  }
  return trimmed;
}

// 4-Tier Asset System (USD | BTC | LN | XMR)
export type AssetSymbol = 'USD' | 'BTC' | 'LN' | 'XMR';

interface SavedConfig {
  providerId: ProviderInfo['id'];
  modelId: string;
  modelsByProvider: Partial<Record<ProviderInfo['id'], string>>;
  apiKeys: Partial<Record<ProviderInfo['id'], string>>;
  crtScanlines: boolean;
}

const STORAGE_KEY = 'hacker_network_static_config_v2';

function loadConfig(): SavedConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedConfig>;
      const provider = AI_PROVIDERS.find((p) => p.id === parsed.providerId) || AI_PROVIDERS[0];
      const savedModelsByProvider: Partial<Record<ProviderInfo['id'], string>> =
        parsed.modelsByProvider && typeof parsed.modelsByProvider === 'object'
          ? { ...parsed.modelsByProvider }
          : {};

      for (const [pid, mid] of Object.entries(savedModelsByProvider)) {
        if (typeof mid === 'string' && mid.trim()) {
          savedModelsByProvider[pid as ProviderInfo['id']] = normalizeProviderModelId(
            pid as ProviderInfo['id'],
            mid
          );
        }
      }

      const rawModelId =
        typeof parsed.modelId === 'string'
          ? normalizeProviderModelId(provider.id, parsed.modelId)
          : '';
      const resolvedModelId =
        rawModelId || savedModelsByProvider[provider.id] || provider.models[0].id;

      savedModelsByProvider[provider.id] = resolvedModelId;

      return {
        providerId: provider.id,
        modelId: resolvedModelId,
        modelsByProvider: savedModelsByProvider,
        apiKeys: parsed.apiKeys && typeof parsed.apiKeys === 'object' ? parsed.apiKeys : {},
        crtScanlines: parsed.crtScanlines ?? true,
      };
    }
  } catch {
    // Fallback to default
  }
  return {
    providerId: 'google',
    modelId: 'gemini-flash-lite-latest',
    modelsByProvider: { google: 'gemini-flash-lite-latest' },
    apiKeys: {},
    crtScanlines: true,
  };
}

function saveConfig(cfg: SavedConfig) {
  try {
    cfg.modelsByProvider = cfg.modelsByProvider || {};
    if (cfg.modelId && cfg.modelId.trim()) {
      cfg.modelsByProvider[cfg.providerId] = cfg.modelId.trim();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // Ignore storage quota errors
  }
}

let config: SavedConfig = loadConfig();
let isConfigOpen = false;
let isSudoMode = false;

type BootState = 'unbooted' | 'booting' | 'booted';
let bootState: BootState = 'unbooted';
let isTrashConfirming = false;
let saveStatusMessage = '';

let keyTestState: {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
} = {
  status: 'idle',
  message: 'READY (TEST를 눌러 연결 확인)',
};

function getLocalSavedKey(providerId: ProviderInfo['id'] = config.providerId): string {
  return (config.apiKeys[providerId] || '').trim();
}

function getCurrentKey(providerId: ProviderInfo['id'] = config.providerId): string {
  return getLocalSavedKey(providerId);
}

function extractApiErrorMessage(data: any, status: number): string {
  if (!data) return `HTTP ${status}`;
  if (typeof data === 'string') return data;
  const errObj = data.error;
  if (typeof errObj === 'string') return errObj;
  if (errObj && typeof errObj === 'object') {
    const baseMsg = errObj.message || errObj.type || `HTTP ${status}`;
    const rawMeta = errObj.metadata?.raw;
    if (typeof rawMeta === 'string' && rawMeta.trim()) {
      return `${baseMsg} (${rawMeta.trim()})`;
    }
    return String(baseMsg);
  }
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }
  return `HTTP ${status}`;
}

function getGoogleEndpoint(modelId: string, key: string): string {
  const host = ['https://generativelanguage', 'googleapis', 'com'].join('.');
  return `${host}/v1beta/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(key)}`;
}

async function fetchViaGatewayOrDirect(
  providerId: ProviderInfo['id'],
  modelId: string,
  key: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: any }> {
  // 1. Try Vite dev/preview server gateway first (bypasses AI Studio browser fetch interceptor)
  try {
    const gwRes = await fetch('/api/llm-gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId,
        modelId,
        apiKey: key,
        payload,
      }),
    });
    const contentType = gwRes.headers.get('content-type') || '';
    if (gwRes.status !== 404 && gwRes.status !== 405 && contentType.includes('application/json')) {
      const gwData = await gwRes.json().catch(() => null);
      if (gwData !== null) {
        return { ok: gwRes.ok, status: gwRes.status, data: gwData };
      }
    }
  } catch {
    // Fallback to direct client-side fetch when deployed on static hosting without /api/llm-gateway
  }

  // 2. Direct client-side fallback (for static web hosting e.g. Vercel / GitHub Pages)
  if (providerId === 'google') {
    const res = await fetch(getGoogleEndpoint(modelId, key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  if (
    providerId === 'openai' ||
    providerId === 'xai' ||
    providerId === 'deepseek' ||
    providerId === 'openrouter'
  ) {
    const endpoint =
      providerId === 'openai'
        ? 'https://api.openai.com/v1/chat/completions'
        : providerId === 'xai'
          ? 'https://api.x.ai/v1/chat/completions'
          : providerId === 'openrouter'
            ? 'https://openrouter.ai/api/v1/chat/completions'
            : 'https://api.deepseek.com/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    };
    if (providerId === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin || 'https://hacker-network.local';
      headers['X-Title'] = 'HACKER_NETWORK';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  if (providerId === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  throw new Error('Unsupported provider');
}

async function runKeyTest() {
  const key = getCurrentKey();
  const provider = AI_PROVIDERS.find((p) => p.id === config.providerId) || AI_PROVIDERS[0];
  const modelId = config.modelId.trim();

  if (!modelId) {
    keyTestState = {
      status: 'error',
      message: 'ERR: 모델명(model_id)을 입력해주세요.',
    };
    renderModalOnly();
    return;
  }

  if (!key) {
    keyTestState = {
      status: 'error',
      message: 'ERR: 설정된 인증 키가 없습니다.',
    };
    renderModalOnly();
    return;
  }

  keyTestState = {
    status: 'testing',
    message: `PING ${provider.id}/${modelId}...`,
  };
  renderModalOnly();

  const startedAt = performance.now();

  try {
    let payload: Record<string, unknown>;
    if (provider.id === 'google') {
      payload = { contents: [{ parts: [{ text: 'ping' }] }] };
    } else if (provider.id === 'anthropic') {
      payload = {
        model: modelId,
        max_tokens: 5,
        messages: [{ role: 'user', content: 'ping' }],
      };
    } else {
      payload = {
        model: modelId,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      };
    }

    const { ok, status, data } = await fetchViaGatewayOrDirect(provider.id, modelId, key, payload);
    if (!ok) {
      throw new Error(extractApiErrorMessage(data, status));
    }
    const ms = Math.round(performance.now() - startedAt);
    keyTestState = {
      status: 'success',
      message: `OK (${ms}ms) · ${modelId}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    keyTestState = {
      status: 'error',
      message: `FAIL: ${msg}`,
    };
  }

  renderModalOnly();
}

// ==========================================
// 3D Wireframe Globe Data (World Cities & Continents)
// ==========================================
interface CityNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  /** XMR(#) cost to establish/plant VPN at this city (0 = FREE) */
  vpnXmrCost: number;
  /** If true, remote VPN routing is blocked; must physically visit (LOC) and use Plant VPN Here */
  directVpnOnly?: boolean;
}

const CITIES: CityNode[] = [
  { id: 'sapporo', name: 'Sapporo', lat: 43.0618, lon: 141.3545, vpnXmrCost: 0 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503, vpnXmrCost: 0 },
  { id: 'seoul', name: 'Seoul', lat: 37.5665, lon: 126.978, vpnXmrCost: 0 },
  { id: 'shanghai', name: 'Shanghai', lat: 31.2304, lon: 121.4737, vpnXmrCost: 0.003, directVpnOnly: true },
  { id: 'hongkong', name: 'Hong Kong', lat: 22.3193, lon: 114.1694, vpnXmrCost: 0.002 },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lon: 103.8198, vpnXmrCost: 0.0025 },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093, vpnXmrCost: 0.0015 },
  { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lon: 77.5946, vpnXmrCost: 0 },
  { id: 'dubai', name: 'Dubai', lat: 25.2048, lon: 55.2708, vpnXmrCost: 0.004, directVpnOnly: true },
  { id: 'moscow', name: 'Moscow', lat: 55.7558, lon: 37.6173, vpnXmrCost: 0.0035, directVpnOnly: true },
  { id: 'istanbul', name: 'Istanbul', lat: 41.0082, lon: 28.9784, vpnXmrCost: 0 },
  { id: 'cairo', name: 'Cairo', lat: 30.0444, lon: 31.2357, vpnXmrCost: 0, directVpnOnly: true },
  { id: 'johannesburg', name: 'Johannesburg', lat: -26.2041, lon: 28.0473, vpnXmrCost: 0.0015 },
  { id: 'frankfurt', name: 'Frankfurt', lat: 50.1109, lon: 8.6821, vpnXmrCost: 0.0025 },
  { id: 'zurich', name: 'Zurich', lat: 47.3769, lon: 8.5417, vpnXmrCost: 0.005 },
  { id: 'london', name: 'London', lat: 51.5072, lon: -0.1276, vpnXmrCost: 0.003 },
  { id: 'reykjavik', name: 'Reykjavik', lat: 64.1466, lon: -21.9426, vpnXmrCost: 0.0045 },
  { id: 'newyork', name: 'New York', lat: 40.7128, lon: -74.006, vpnXmrCost: 0.003 },
  { id: 'toronto', name: 'Toronto', lat: 43.6532, lon: -79.3832, vpnXmrCost: 0.0015 },
  { id: 'sanfrancisco', name: 'San Francisco', lat: 37.7749, lon: -122.4194, vpnXmrCost: 0.003 },
  { id: 'mexico', name: 'Mexico City', lat: 19.4326, lon: -99.1332, vpnXmrCost: 0 },
  { id: 'saopaulo', name: 'São Paulo', lat: -23.5505, lon: -46.6333, vpnXmrCost: 0 },
  { id: 'buenosaires', name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, vpnXmrCost: 0.002, directVpnOnly: true },
];

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// ==========================================
// Multi-TTY Workspace & Roleplay Save State
// ==========================================
type TtyId = 1 | 2 | 3 | 4 | 5;
const TTY_IDS: TtyId[] = [1, 2, 3, 4, 5];

export interface LogEntry {
  text: string;
  sudo?: boolean;
}

interface WorldScaffold {
  /** 세계 단위로 엮여 돌아가는 거시적 흐름, 세력/정세, 글로벌 사건 */
  globalState: string[];
  /** 도시/지역별(cityId 기준) 로컬 이슈, 지역 네트워크/현장 상황 */
  regionalState: Record<string, string>;
  /** 활성 단서, 타겟/인물/노드 및 접근 조건(원격 / 특정 지역 VPN / 직접 방문 LOC 등) */
  activeLeads: string[];
}

interface RoleplaySaveState {
  version: 1;
  physicalLocationId: string;
  vpnLocationIds: Record<TtyId, string | null>;
  usdBalance: number;
  xmrBalance: number;
  permanentMemory: string[];
  temporaryMemory: string;
  worldScaffold: WorldScaffold;
  ttyLogs: Record<TtyId, LogEntry[]>;
}

const SAVE_STORAGE_KEY = 'hacker_network_rp_save_v1';

const INITIAL_OPENING_LOGS: LogEntry[] = [
  { text: '$ 삿포로에 오긴 왔는데... 도대체 뭘 해야 할지 모르겠다 씨발... 돈도 없고', sudo: false },
  { text: '> 그래도 목표하던 대로 몸뚱아리는 오긴 했지 않습니까', sudo: false },
  { text: '$ 담배 떨어졌네... 세븐스타나 사온다', sudo: false },
  { text: '> 네, 돌아오시면 말씀해주세요.', sudo: false },
  { text: '[$] 지출이 감지되었습니다: 3.99', sudo: false },
];

const INITIAL_PERMANENT_MEMORY: string[] = [
  '주인공은 현재 일본 삿포로(Sapporo)에 도착해 있으며, 세븐스타 담배($3.99)를 사고 남은 초기 자금은 $10.51 USD와 0.0420 XMR이다.',
  '로컬 시스템에는 주인공을 보좌하는 파트너 AI가 상주하며, 주인공의 과거·목적·세계관 사건은 사전에 고정되어 있지 않고 플레이어의 대화와 행동을 통해 백지 상태에서 형성된다.',
];

const INITIAL_TEMPORARY_MEMORY =
  '삿포로에 도착해 세븐스타 담배를 사 들고 막 돌아온 시점. 앞으로 어떤 일을 벌일지 아직 정해지지 않은 열린 상태.';

function createInitialSaveState(): RoleplaySaveState {
  return {
    version: 1,
    physicalLocationId: 'sapporo',
    vpnLocationIds: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    },
    usdBalance: 10.51,
    xmrBalance: 0.042,
    permanentMemory: [...INITIAL_PERMANENT_MEMORY],
    temporaryMemory: INITIAL_TEMPORARY_MEMORY,
    worldScaffold: {
      globalState: [],
      regionalState: {},
      activeLeads: [],
    },
    ttyLogs: {
      1: INITIAL_OPENING_LOGS.map((item) => ({ ...item })),
      2: [],
      3: [],
      4: [],
      5: [],
    },
  };
}

function isTransientOrErrorLog(text: string): boolean {
  const trimmed = text.trim();
  return (
    trimmed.startsWith('[BOOT]') ||
    trimmed.startsWith('[BOOT ERR]') ||
    trimmed.startsWith('[NET]') ||
    trimmed.startsWith('[WALLET]') ||
    trimmed.startsWith('[DAEMON]') ||
    trimmed.startsWith('[DAEMON ERR]') ||
    trimmed.startsWith('[SYS]') ||
    trimmed === 'Continuing session...' ||
    trimmed === '> ...'
  );
}

function sanitizeSaveState(raw: unknown): RoleplaySaveState {
  const fallback = createInitialSaveState();
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Partial<RoleplaySaveState>;

  const validCity = CITIES.some((c) => c.id === obj.physicalLocationId)
    ? (obj.physicalLocationId as string)
    : 'sapporo';

  const vpnMap: Record<TtyId, string | null> = { 1: null, 2: null, 3: null, 4: null, 5: null };
  if (obj.vpnLocationIds && typeof obj.vpnLocationIds === 'object') {
    for (const id of [2, 3, 4, 5] as TtyId[]) {
      const candidate = obj.vpnLocationIds[id];
      vpnMap[id] =
        typeof candidate === 'string' && CITIES.some((c) => c.id === candidate)
          ? candidate
          : null;
    }
  }

  const logsMap: Record<TtyId, LogEntry[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  if (obj.ttyLogs && typeof obj.ttyLogs === 'object') {
    for (const id of TTY_IDS) {
      const arr = obj.ttyLogs[id];
      if (Array.isArray(arr)) {
        logsMap[id] = arr
          .filter((item) => item && typeof item.text === 'string' && !isTransientOrErrorLog(item.text))
          .map((item) => ({ text: String(item.text), sudo: Boolean(item.sudo) }));
      }
    }
    // Migrate untouched 4-line opening save from earlier session to include the cigarette expense line
    if (
      logsMap[1].length === 4 &&
      logsMap[1][3]?.text === '> 네, 돌아오시면 말씀해주세요.'
    ) {
      logsMap[1].push({ text: '[$] 지출이 감지되었습니다: 3.99', sudo: false });
    }
    if (logsMap[1].length === 0) {
      logsMap[1] = fallback.ttyLogs[1];
    }
  } else {
    logsMap[1] = fallback.ttyLogs[1];
  }

  let cleanUsd =
    typeof obj.usdBalance === 'number' && Number.isFinite(obj.usdBalance)
      ? Math.max(0, obj.usdBalance)
      : fallback.usdBalance;
  // Migrate old 14.50 initial balance before 3.99 deduction
  if (cleanUsd === 14.5 && logsMap[1].some((l) => l.text.includes('3.99'))) {
    cleanUsd = 10.51;
  }

  const permMem = Array.isArray(obj.permanentMemory)
    ? obj.permanentMemory
        .map((m) => String(m).trim())
        .filter((m) => Boolean(m) && !m.includes('정체불명의 사건/추적을 피해'))
    : [];

  const tempMem =
    typeof obj.temporaryMemory === 'string' &&
    obj.temporaryMemory.trim() &&
    !obj.temporaryMemory.includes('숙박비·생활비와 작전 자금을 마련할')
      ? obj.temporaryMemory.trim()
      : fallback.temporaryMemory;

  const rawScaffold = obj.worldScaffold;
  const globalState =
    rawScaffold && Array.isArray(rawScaffold.globalState)
      ? rawScaffold.globalState.map((s) => String(s).trim()).filter(Boolean)
      : [];
  const regionalState: Record<string, string> = {};
  if (rawScaffold && rawScaffold.regionalState && typeof rawScaffold.regionalState === 'object') {
    for (const [k, v] of Object.entries(rawScaffold.regionalState)) {
      if (typeof v === 'string' && v.trim()) {
        regionalState[k.trim().toLowerCase()] = v.trim();
      }
    }
  }
  const activeLeads =
    rawScaffold && Array.isArray(rawScaffold.activeLeads)
      ? rawScaffold.activeLeads.map((s) => String(s).trim()).filter(Boolean)
      : [];

  return {
    version: 1,
    physicalLocationId: validCity,
    vpnLocationIds: vpnMap,
    usdBalance: cleanUsd,
    xmrBalance:
      typeof obj.xmrBalance === 'number' && Number.isFinite(obj.xmrBalance)
        ? Math.max(0, obj.xmrBalance)
        : fallback.xmrBalance,
    permanentMemory: permMem.length > 0 ? permMem : [...fallback.permanentMemory],
    temporaryMemory: tempMem,
    worldScaffold: {
      globalState,
      regionalState,
      activeLeads,
    },
    ttyLogs: logsMap,
  };
}

function loadSaveState(): RoleplaySaveState {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (raw) {
      return sanitizeSaveState(JSON.parse(raw));
    }
  } catch {
    // Fallback to initial save state
  }
  const initial = createInitialSaveState();
  persistSaveState(initial);
  return initial;
}

function persistSaveState(state: RoleplaySaveState) {
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

let saveState: RoleplaySaveState = loadSaveState();
let activeTty: TtyId = 1;

// Workspace 1 = Physical Location (LOC)
// Workspaces 2..5 = VPN Node Override (null = VPN unused, follows TTY 1 LOC)
let physicalLocationId = saveState.physicalLocationId;

const vpnLocationIds: Record<TtyId, string | null> = {
  1: null,
  2: saveState.vpnLocationIds[2],
  3: saveState.vpnLocationIds[3],
  4: saveState.vpnLocationIds[4],
  5: saveState.vpnLocationIds[5],
};

let globeSelectedCityId: string | null = null;
let unbootedSelectedCityId: string | null = null;
let displayedUsd = 0;
let displayedXmr = 0;

function syncAndPersistSaveState() {
  saveState.physicalLocationId = physicalLocationId;
  saveState.vpnLocationIds = { ...vpnLocationIds };
  for (const id of TTY_IDS) {
    saveState.ttyLogs[id] = ttyLogs[id].filter((entry) => !isTransientOrErrorLog(entry.text));
  }
  persistSaveState(saveState);
}

function isWorkspaceUsingVpn(tty: TtyId = activeTty): boolean {
  if (tty === 1) return false;
  return vpnLocationIds[tty] !== null;
}

function getActiveWorkspaceLocationId(tty: TtyId = activeTty): string {
  if (tty !== 1 && vpnLocationIds[tty] !== null) {
    return vpnLocationIds[tty]!;
  }
  return physicalLocationId;
}

// Physical Flight State (for TTY 1 LOC) & VPN Bridge/Ping State (for TTY 2..5)
interface TransitState {
  fromCity: CityNode;
  toCity: CityNode;
  camStartCity: CityNode;
  startTime: number;
  durationMs: number;
  progress: number;
  estimatedPingMs: number;
}

let activeFlight: TransitState | null = null;
const activeVpnBridges: Partial<Record<TtyId, TransitState>> = {};

// Zoom State
const MIN_ZOOM = 0.75;
const MAX_ZOOM = 3.0;
let zoomLevel = 1.0;
let targetZoom = 1.0;

// Base Layout Constants (Dynamically scaled in updateViewportGeometry for PC vs Mobile)
const HEADER_HEIGHT = 40;
const GLOBE_TILE_HEIGHT = 210;
const SUDO_TAB_HEIGHT = 26;
const INPUT_BAR_HEIGHT = 40;
const INPUT_TOTAL_HEIGHT = SUDO_TAB_HEIGHT + INPUT_BAR_HEIGHT;
const GAP = 8;

const root = document.getElementById('app');

if (root) {
  root.innerHTML = `
    <div id="viewport-shell" class="fixed left-0 right-0 top-0 overflow-hidden bg-[#050505] text-[#e5e5e5] select-none font-mono flex flex-col">
      <!-- Fixed Top Bar (scanlines applied strictly to this top bar) -->
      <header
        id="top-header-bar"
        style="height: ${HEADER_HEIGHT}px;"
        class="relative z-10 w-full bg-[#0a0a0a] border-b border-neutral-800 overflow-hidden shrink-0"
      >
        <div id="scanline-overlay" class="pointer-events-none absolute inset-0 crt-scanlines z-20"></div>
        <div class="relative z-10 w-full max-w-5xl h-full mx-auto px-3 sm:px-4 flex items-center justify-between gap-4">
          <div class="text-xs sm:text-sm font-bold tracking-wider text-neutral-100 whitespace-nowrap shrink-0">
            HACKER_NETWORK
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              id="top-pwa-install-btn"
              type="button"
              class="hidden px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-bold text-black bg-neutral-100 border border-neutral-100 hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              INSTALL APP
            </button>
            <button
              id="open-config-btn"
              class="px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-medium text-neutral-200 bg-neutral-900 border border-neutral-700 hover:border-neutral-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              CONFIG
            </button>
          </div>
        </div>
      </header>

      <!-- Main Flex Column Workspace (Globe Tile + Elastic Log Tile + Unified Input Tile) -->
      <div
        id="main-workspace-col"
        style="padding-bottom: ${GAP}px;"
        class="relative flex-1 min-h-0 w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col overflow-hidden"
      >
        <!-- Tile 1: Responsive Wireframe Globe Tile -->
        <section
          id="globe-tile"
          style="margin-top: ${GAP}px; height: ${GLOBE_TILE_HEIGHT}px;"
          class="relative z-10 w-full bg-[#080808] border border-neutral-400 flex flex-col overflow-hidden shrink-0"
        >
          <div class="h-7 sm:h-8 px-3 sm:px-3.5 border-b border-neutral-800 flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 shrink-0">
            <span class="text-neutral-200 font-bold">globe://wireframe</span>
            <span id="globe-coords" class="text-neutral-400 tabular-nums whitespace-nowrap shrink-0">
              LAT +30.0° · LON +141.4°
            </span>
          </div>

          <div id="globe-container" class="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none">
            <canvas id="globe-canvas" class="w-full h-full block"></canvas>

            <!-- Bottom-Left Location (TTY 1) / VPN (TTY 2..5) Action Control -->
            <div id="location-action-bar" class="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-3.5 z-20 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px]"></div>

            <!-- Right-Side Scrollable / Draggable Zoom Axis -->
            <div
              id="zoom-axis"
              title="Scroll or drag to zoom"
              class="absolute top-2.5 bottom-2.5 right-3 sm:right-3.5 z-20 w-6 sm:w-7 bg-black/80 border border-neutral-700 hover:border-neutral-400 flex flex-col items-center justify-between py-1.5 cursor-ns-resize select-none"
            >
              <span class="text-[9px] sm:text-[10px] text-neutral-400 leading-none">+</span>
              <div id="zoom-track" class="relative flex-1 w-full my-1 flex justify-center">
                <div class="w-[1px] h-full bg-neutral-700"></div>
                <div class="absolute inset-y-0 left-1 right-1 flex flex-col justify-between pointer-events-none py-1">
                  <div class="h-[1px] bg-neutral-700"></div>
                  <div class="h-[1px] bg-neutral-700"></div>
                  <div class="h-[1px] bg-neutral-600"></div>
                  <div class="h-[1px] bg-neutral-700"></div>
                  <div class="h-[1px] bg-neutral-700"></div>
                </div>
                <div
                  id="zoom-thumb"
                  class="absolute left-0.5 right-0.5 h-2 bg-neutral-100 border border-black pointer-events-none"
                  style="top: 50%; transform: translateY(-50%);"
                ></div>
              </div>
              <span id="zoom-readout" class="text-[9px] sm:text-[10px] text-neutral-300 tabular-nums leading-none">1.0x</span>
            </div>
          </div>
        </section>

        <!-- Tile 2A: Elastic Log Window Tile with Packed Tiled 1..5 TTY Workspaces -->
        <section
          id="log-tile"
          style="margin-top: ${GAP}px;"
          class="relative z-10 w-full flex-1 min-h-0 bg-[#080808] border border-neutral-400 flex flex-col overflow-hidden"
        >
          <div class="h-7 sm:h-8 pl-3 sm:pl-3.5 pr-0 border-b border-neutral-800 flex items-stretch justify-between text-[11px] sm:text-xs text-neutral-400 shrink-0">
            <div class="flex items-center">
              <span id="tty-title-label" class="text-neutral-200 font-bold whitespace-nowrap shrink-0">tty1://log</span>
            </div>
            <div id="tty-workspace-bar" class="flex items-stretch h-full"></div>
          </div>
          <div class="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col">
            <div
              id="log-scroll"
              class="flex-1 min-h-0 w-full overflow-y-auto px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[13.5px] md:text-sm leading-relaxed select-text"
            ></div>
            <!-- Centered Pre-Boot Overlay (Large Boot up + Small Config) -->
            <div
              id="boot-overlay"
              class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 sm:gap-3 pointer-events-none"
            >
              <button
                id="boot-up-btn"
                type="button"
                class="pointer-events-auto px-8 py-2.5 sm:px-10 sm:py-3 bg-neutral-100 text-black text-sm sm:text-base font-bold border border-neutral-100 hover:bg-white transition-colors cursor-pointer tracking-wider shadow-[0_0_24px_rgba(0,0,0,0.9)]"
              >
                Boot up
              </button>
              <button
                id="boot-config-btn"
                type="button"
                class="pointer-events-auto px-3.5 py-1 sm:px-4 sm:py-1.5 bg-[#0b0b0b] text-neutral-300 text-[11px] sm:text-xs font-medium border border-neutral-700 hover:border-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Config
              </button>
            </div>
          </div>
        </section>

        <!-- Tile 2B: Unified Input Tile (Strictly below log-tile, never overlapping) -->
        <div
          id="input-tile-wrapper"
          style="height: ${INPUT_TOTAL_HEIGHT}px; margin-top: ${GAP}px;"
          class="relative z-30 w-full shrink-0"
        >
          <div
            id="input-tile-box"
            class="w-full h-full bg-[#090909] border border-neutral-300 flex flex-col transition-colors overflow-hidden"
          >
            <div
              id="input-top-strip"
              style="height: ${SUDO_TAB_HEIGHT}px;"
              class="w-full flex items-stretch border-b border-neutral-300 transition-colors shrink-0"
            >
              <button
                id="sudo-toggle-btn"
                type="button"
                class="h-full px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-bold bg-[#090909] border-r border-neutral-300 text-neutral-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                SUDO
              </button>

              <div
                id="asset-status-strip"
                class="flex-1 h-full bg-[#090909] px-3 sm:px-4 flex items-center text-xs sm:text-[13.5px] tabular-nums select-none"
              >
                <div class="flex-1 min-w-0 flex items-center justify-between gap-2 pr-3 sm:pr-4">
                  <span id="usd-symbol-label" class="font-bold text-neutral-300 shrink-0">$</span>
                  <span id="usd-balance-val" class="text-right font-semibold text-neutral-100 truncate">0.00</span>
                </div>
                <div id="asset-divider" class="h-3.5 sm:h-4 w-[1px] bg-neutral-700 shrink-0 transition-colors"></div>
                <div class="flex-1 min-w-0 flex items-center justify-between gap-2 pl-3 sm:pl-4">
                  <span id="xmr-balance-val" class="text-left font-semibold text-neutral-100 truncate transition-colors">0.0000</span>
                  <span id="xmr-symbol-label" class="font-bold text-neutral-300 shrink-0 transition-colors">#</span>
                </div>
              </div>
            </div>

            <form
              id="input-form"
              class="w-full flex-1 bg-[#090909] flex items-stretch px-3 sm:px-3.5 gap-2 sm:gap-2.5 transition-colors cursor-text"
            >
              <span id="prompt-symbol" class="text-xs sm:text-sm md:text-base font-bold text-neutral-100 whitespace-nowrap shrink-0 flex items-center select-none">
                $
              </span>
              <input
                id="cmd-input"
                type="text"
                inputmode="text"
                enterkeyhint="send"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                class="flex-1 min-w-0 h-full py-1.5 sm:py-2 bg-transparent text-xs sm:text-sm md:text-[15px] text-neutral-100 select-text touch-manipulation focus:outline-none"
              />
              <button
                id="submit-action-btn"
                type="submit"
                class="self-center px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-neutral-100 text-black text-[11px] sm:text-xs font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0 select-none"
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Mount -->
      <div id="modal-mount" class="relative z-50"></div>
    </div>
  `;
}

// ==========================================
// SUDO Toggle Styling Logic
// ==========================================
const inputTileBoxEl = document.getElementById('input-tile-box');
const inputTopStripEl = document.getElementById('input-top-strip');
const sudoBtnEl = document.getElementById('sudo-toggle-btn');
const inputFormEl = document.getElementById('input-form') as HTMLFormElement | null;
const promptSymbolEl = document.getElementById('prompt-symbol');
const cmdInputEl = document.getElementById('cmd-input') as HTMLInputElement | null;
const submitActionBtnEl = document.getElementById('submit-action-btn') as HTMLButtonElement | null;
const xmrBalanceValEl = document.getElementById('xmr-balance-val');
const xmrSymbolLabelEl = document.getElementById('xmr-symbol-label');

function applySudoVisualState() {
  if (
    !inputTileBoxEl ||
    !inputTopStripEl ||
    !sudoBtnEl ||
    !inputFormEl ||
    !promptSymbolEl ||
    !cmdInputEl ||
    !submitActionBtnEl
  ) {
    return;
  }

  if (isSudoMode) {
    inputTileBoxEl.className =
      'pointer-events-auto w-full h-full bg-[#090909] border border-red-500 flex flex-col shadow-[0_-4px_16px_rgba(0,0,0,0.85)] transition-colors overflow-hidden';
    inputTopStripEl.className =
      'w-full flex items-stretch border-b border-red-500 transition-colors shrink-0';
    sudoBtnEl.className =
      'h-full px-2.5 text-[11px] font-bold bg-[#090909] border-r border-red-500 text-red-500 transition-colors cursor-pointer whitespace-nowrap shrink-0';
    promptSymbolEl.textContent = '#';
    promptSymbolEl.className = 'text-xs font-bold text-red-500 whitespace-nowrap shrink-0 flex items-center select-none';
    cmdInputEl.className =
      'flex-1 min-w-0 h-full py-1.5 bg-transparent text-xs text-red-500 caret-red-500 select-text touch-manipulation focus:outline-none';
    submitActionBtnEl.textContent = 'EXEC';
    submitActionBtnEl.className =
      'self-center px-2.5 py-1 bg-red-500 text-black text-[11px] font-bold hover:bg-red-400 transition-colors cursor-pointer whitespace-nowrap shrink-0 select-none';
    if (xmrBalanceValEl) {
      xmrBalanceValEl.className = 'text-left font-semibold text-red-500 truncate transition-colors';
    }
    if (xmrSymbolLabelEl) {
      xmrSymbolLabelEl.className = 'font-bold text-red-500 shrink-0 transition-colors';
    }
  } else {
    inputTileBoxEl.className =
      'pointer-events-auto w-full h-full bg-[#090909] border border-neutral-300 flex flex-col shadow-[0_-4px_16px_rgba(0,0,0,0.85)] transition-colors overflow-hidden';
    inputTopStripEl.className =
      'w-full flex items-stretch border-b border-neutral-300 transition-colors shrink-0';
    sudoBtnEl.className =
      'h-full px-2.5 text-[11px] font-bold bg-[#090909] border-r border-neutral-300 text-neutral-100 transition-colors cursor-pointer whitespace-nowrap shrink-0';
    promptSymbolEl.textContent = '$';
    promptSymbolEl.className = 'text-xs font-bold text-neutral-100 whitespace-nowrap shrink-0 flex items-center select-none';
    cmdInputEl.className =
      'flex-1 min-w-0 h-full py-1.5 bg-transparent text-xs text-neutral-100 caret-neutral-100 select-text touch-manipulation focus:outline-none';
    submitActionBtnEl.textContent = 'SEND';
    submitActionBtnEl.className =
      'self-center px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0 select-none';
    if (xmrBalanceValEl) {
      xmrBalanceValEl.className = 'text-left font-semibold text-neutral-100 truncate transition-colors';
    }
    if (xmrSymbolLabelEl) {
      xmrSymbolLabelEl.className = 'font-bold text-neutral-300 shrink-0 transition-colors';
    }
  }
}

sudoBtnEl?.addEventListener('mousedown', (e) => {
  e.preventDefault();
});

sudoBtnEl?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  isSudoMode = !isSudoMode;
  applySudoVisualState();
});

// Ensure tapping anywhere in the input bar row (prompt symbol or padding) focuses the text input on mobile
inputFormEl?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (target && target.closest('#submit-action-btn')) return;
  if (cmdInputEl && document.activeElement !== cmdInputEl) {
    cmdInputEl.focus();
  }
});

applySudoVisualState();

// ==========================================
// Per-TTY Log Storage & Bottom-Anchored Scroll Engine
// ==========================================
const viewportShell = document.getElementById('viewport-shell');
const logTileEl = document.getElementById('log-tile');
const logScrollEl = document.getElementById('log-scroll');
const bootOverlayEl = document.getElementById('boot-overlay');
const ttyTitleLabelEl = document.getElementById('tty-title-label');
const ttyWorkspaceBarEl = document.getElementById('tty-workspace-bar');
const usdBalanceValEl = document.getElementById('usd-balance-val');

const ttyLogs: Record<TtyId, LogEntry[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

function renderBootOverlayState() {
  if (!bootOverlayEl) return;
  bootOverlayEl.style.display = bootState === 'unbooted' ? 'flex' : 'none';
}

let balanceAnimFrame: number | null = null;

function formatUsd(val: number): string {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatXmr(val: number): string {
  return val.toFixed(4);
}

function setDisplayedBalancesImmediate(usd: number, xmr: number) {
  if (balanceAnimFrame !== null) {
    cancelAnimationFrame(balanceAnimFrame);
    balanceAnimFrame = null;
  }
  displayedUsd = usd;
  displayedXmr = xmr;
  if (usdBalanceValEl) usdBalanceValEl.textContent = formatUsd(usd);
  if (xmrBalanceValEl) xmrBalanceValEl.textContent = formatXmr(xmr);
}

function animateBalancesTo(targetUsd: number, targetXmr: number, durationMs = 720) {
  if (balanceAnimFrame !== null) {
    cancelAnimationFrame(balanceAnimFrame);
    balanceAnimFrame = null;
  }
  const startUsd = displayedUsd;
  const startXmr = displayedXmr;
  const startTime = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / durationMs);
    const ease = 1 - Math.pow(1 - t, 3);
    displayedUsd = startUsd + (targetUsd - startUsd) * ease;
    displayedXmr = startXmr + (targetXmr - startXmr) * ease;

    if (usdBalanceValEl) usdBalanceValEl.textContent = formatUsd(displayedUsd);
    if (xmrBalanceValEl) xmrBalanceValEl.textContent = formatXmr(displayedXmr);

    if (t < 1) {
      balanceAnimFrame = requestAnimationFrame(step);
    } else {
      displayedUsd = targetUsd;
      displayedXmr = targetXmr;
      if (usdBalanceValEl) usdBalanceValEl.textContent = formatUsd(targetUsd);
      if (xmrBalanceValEl) xmrBalanceValEl.textContent = formatXmr(targetXmr);
      balanceAnimFrame = null;
    }
  };

  balanceAnimFrame = requestAnimationFrame(step);
}

const ttyScrollBottomOffsets: Record<TtyId, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

let isProgrammaticScroll = false;

function applySavedBottomScroll() {
  if (!logScrollEl) return;
  isProgrammaticScroll = true;
  const savedOffset = ttyScrollBottomOffsets[activeTty];
  const maxScroll = Math.max(0, logScrollEl.scrollHeight - logScrollEl.clientHeight);
  const targetTop = Math.max(0, Math.min(maxScroll, maxScroll - savedOffset));
  logScrollEl.scrollTop = targetTop;
  isProgrammaticScroll = false;
}

function renderTtyHeader() {
  if (ttyTitleLabelEl) {
    ttyTitleLabelEl.textContent = `tty${activeTty}://log`;
  }
  if (!ttyWorkspaceBarEl) return;

  ttyWorkspaceBarEl.innerHTML = TTY_IDS.map((id) => {
    const isActive = id === activeTty;
    return `
      <button
        type="button"
        data-tty-id="${id}"
        class="tty-ws-btn h-full w-7 sm:w-8 aspect-square flex items-center justify-center text-xs sm:text-[13px] leading-none border-l transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
          isActive
            ? 'bg-neutral-100 text-black border-neutral-100 font-bold'
            : 'bg-[#090909] text-neutral-400 border-neutral-700 hover:bg-neutral-900 hover:text-neutral-100 font-medium'
        }"
      >
        ${id}
      </button>
    `;
  }).join('');

  ttyWorkspaceBarEl.querySelectorAll('.tty-ws-btn').forEach((btn) => {
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const targetId = Number(btn.getAttribute('data-tty-id')) as TtyId;
      if (targetId && targetId !== activeTty) {
        switchTtyWorkspace(targetId);
      }
    });
  });
}

let pendingAiRequest: { tty: TtyId; sudo: boolean } | null = null;

function renderLogLines(preserveBottomOffset = true) {
  if (!logScrollEl) return;
  const entries = ttyLogs[activeTty];
  const itemsHtml = entries
    .map(
      (entry) =>
        `<div class="break-words ${
          entry.sudo ? 'text-red-500 font-semibold' : 'text-neutral-200'
        }">${entry.text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</div>`
    )
    .join('');

  const pendingHtml =
    pendingAiRequest && pendingAiRequest.tty === activeTty
      ? `<div class="flex items-center gap-2 pt-0.5 ${
          pendingAiRequest.sudo ? 'text-red-500 font-semibold' : 'text-neutral-400'
        } animate-pulse">
          <span>&gt;</span>
          <span class="inline-block w-2 h-3.5 sm:h-4 ${
            pendingAiRequest.sudo ? 'bg-red-500' : 'bg-neutral-300'
          }"></span>
          <span class="text-[11px] sm:text-xs">partner_ai 응답 대기 중...</span>
        </div>`
      : '';

  logScrollEl.innerHTML = `<div class="flex flex-col justify-start space-y-1 sm:space-y-1.5">${itemsHtml}${pendingHtml}</div>`;

  if (preserveBottomOffset) {
    applySavedBottomScroll();
  }
}

function appendLog(text: string, sudo = false, forceStickToBottomIfNear = false) {
  const currentOffset = ttyScrollBottomOffsets[activeTty];
  const wasNearBottom = currentOffset <= 6;
  ttyLogs[activeTty].push({ text, sudo });

  if (logScrollEl) {
    const prevScrollHeight = logScrollEl.scrollHeight;
    renderLogLines(false);
    const addedHeight = Math.max(0, logScrollEl.scrollHeight - prevScrollHeight);

    if (forceStickToBottomIfNear || wasNearBottom) {
      ttyScrollBottomOffsets[activeTty] = 0;
    } else {
      ttyScrollBottomOffsets[activeTty] += addedHeight;
    }
    applySavedBottomScroll();
  }
}

logScrollEl?.addEventListener(
  'scroll',
  () => {
    if (isProgrammaticScroll || !logScrollEl) return;
    if (logScrollEl.clientHeight <= 0) return;
    const maxScroll = Math.max(0, logScrollEl.scrollHeight - logScrollEl.clientHeight);
    ttyScrollBottomOffsets[activeTty] = Math.max(0, maxScroll - logScrollEl.scrollTop);
  },
  { passive: true }
);

let referenceWindowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
let lastAppliedGlobeHeight = GLOBE_TILE_HEIGHT;

function updateViewportGeometry() {
  if (!viewportShell || !logTileEl) return;

  const vv = window.visualViewport;
  const vHeight = vv ? vv.height : window.innerHeight;
  const vWidth = window.innerWidth;
  const vOffsetTop = vv ? vv.offsetTop : 0;

  viewportShell.style.top = `${vOffsetTop}px`;
  viewportShell.style.height = `${vHeight}px`;

  // Scale UI bar heights on larger PC/tablet screens while keeping mobile compact
  const isDesktopWidth = vWidth >= 640;
  const headerH = isDesktopWidth ? 46 : HEADER_HEIGHT;
  const sudoTabH = isDesktopWidth ? 32 : SUDO_TAB_HEIGHT;
  const inputBarH = isDesktopWidth ? 48 : INPUT_BAR_HEIGHT;
  const inputTotalH = sudoTabH + inputBarH;
  const gap = isDesktopWidth ? 10 : GAP;

  // On mobile with touch keyboard open, preserve referenceWindowHeight so the globe doesn't jump
  const isCoarsePointer =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  const isMobileKeyboardLikelyOpen =
    isCoarsePointer &&
    document.activeElement === cmdInputEl &&
    vHeight < (window.screen?.height || 800) * 0.65;

  if (!isMobileKeyboardLikelyOpen || vHeight > referenceWindowHeight) {
    referenceWindowHeight = vHeight;
  }

  // Maintain a sleek, wide aspect ratio while providing generous vertical presence on PC
  const colWidth = Math.min(vWidth, 1024) - (isDesktopWidth ? 32 : 24);
  const minH = isDesktopWidth ? 260 : 185;
  const maxH = isDesktopWidth ? 360 : 210;
  const wideMaxH = isDesktopWidth ? Math.round(colWidth * 0.40) : Math.round(colWidth * 0.55);
  const pcHeightBonus = isDesktopWidth ? Math.min(100, Math.max(0, (referenceWindowHeight - 650) * 0.28)) : 0;
  const desiredGlobeH = Math.max(minH, Math.min(maxH, Math.min(wideMaxH, minH + pcHeightBonus)));
  const maxFittingGlobeH = Math.max(
    GLOBE_TILE_HEIGHT,
    vHeight - headerH - inputTotalH - gap * 3
  );
  const globeTileH = Math.min(desiredGlobeH, maxFittingGlobeH);

  const topHeaderEl = document.getElementById('top-header-bar');
  if (topHeaderEl) topHeaderEl.style.height = `${headerH}px`;

  const mainColEl = document.getElementById('main-workspace-col');
  if (mainColEl) mainColEl.style.paddingBottom = `${gap}px`;

  const globeTileEl = document.getElementById('globe-tile');
  if (globeTileEl) {
    globeTileEl.style.marginTop = `${gap}px`;
    globeTileEl.style.height = `${globeTileH}px`;
  }

  const inputWrapperEl = document.getElementById('input-tile-wrapper');
  if (inputWrapperEl) {
    inputWrapperEl.style.height = `${inputTotalH}px`;
    inputWrapperEl.style.marginTop = `${gap}px`;
  }

  if (inputTopStripEl) {
    inputTopStripEl.style.height = `${sudoTabH}px`;
  }

  const topUIHeight = headerH + gap + globeTileH;
  const bottomReserved = gap + inputTotalH + gap;
  const availableLogHeight = Math.max(0, vHeight - topUIHeight - gap - bottomReserved);

  isProgrammaticScroll = true;
  if (availableLogHeight <= 24) {
    logTileEl.style.display = 'none';
  } else {
    logTileEl.style.display = 'flex';
    logTileEl.style.borderWidth = '1px';
    logTileEl.style.marginTop = `${gap}px`;
  }

  if (logScrollEl && logScrollEl.clientHeight > 0) {
    const savedOffset = ttyScrollBottomOffsets[activeTty];
    const maxScroll = Math.max(0, logScrollEl.scrollHeight - logScrollEl.clientHeight);
    logScrollEl.scrollTop = Math.max(0, Math.min(maxScroll, maxScroll - savedOffset));
  }
  isProgrammaticScroll = false;

  if (globeTileH !== lastAppliedGlobeHeight) {
    lastAppliedGlobeHeight = globeTileH;
    requestGlobeResize?.();
  }
}

window.addEventListener('resize', updateViewportGeometry);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateViewportGeometry);
  window.visualViewport.addEventListener('scroll', updateViewportGeometry);
}

// ==========================================
// City, LOC Flight (TTY 1) & VPN Tunnel (TTY 2..5) Helpers
// ==========================================
function getCityById(id: string | null): CityNode {
  return CITIES.find((c) => c.id === id) || CITIES[0];
}

function getAngularDistance(a: CityNode, b: CityNode): number {
  const lat1 = a.lat * DEG2RAD;
  const lat2 = b.lat * DEG2RAD;
  const dLat = lat2 - lat1;
  const dLon = (b.lon - a.lon) * DEG2RAD;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}

function normalizeAngleDiff(target: number, current: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff;
}

let focusCityOnGlobe: ((city: CityNode) => void) | null = null;
let getCurrentGlobeCameraCity: (() => CityNode) | null = null;
let requestGlobeWake: (() => void) | null = null;
let requestGlobeResize: (() => void) | null = null;

function getFlightUsdCost(origin: CityNode, dest: CityNode): number {
  if (origin.id === dest.id) return 0;
  const radDist = getAngularDistance(origin, dest);
  const raw = 3.5 + (radDist / Math.PI) * 24.5;
  return Number(raw.toFixed(2));
}

function formatVpnCostBadge(city: CityNode): string {
  if (city.vpnXmrCost <= 0) return '';
  return `${city.vpnXmrCost.toFixed(4)} #`;
}

function bindInstantButton(el: HTMLElement | null, handler: () => void) {
  if (!el) return;
  let handledByPointer = false;
  el.addEventListener('mousedown', (e) => e.preventDefault());
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handledByPointer = true;
    handler();
  });
  el.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (handledByPointer) {
      handledByPointer = false;
      return;
    }
    handler();
  });
}

function switchTtyWorkspace(targetTty: TtyId) {
  activeTty = targetTty;
  if (bootState !== 'unbooted' && globeSelectedCityId === null) {
    const activeCityId = getActiveWorkspaceLocationId(targetTty);
    const city = getCityById(activeCityId);
    if (focusCityOnGlobe) focusCityOnGlobe(city);
  }
  requestGlobeWake?.();
  renderTtyHeader();
  renderLogLines(true);
  renderLocationActionBar();
}

function getActiveTransitForCurrentTty(): TransitState | null {
  if (bootState === 'unbooted') return null;
  if (activeTty === 1) return activeFlight;
  if (activeVpnBridges[activeTty]) return activeVpnBridges[activeTty]!;
  // If VPN is unused on this workspace, it follows TTY 1's physical flight
  if (!isWorkspaceUsingVpn(activeTty) && activeFlight) return activeFlight;
  return null;
}

function renderLocationActionBar() {
  const bar = document.getElementById('location-action-bar');
  if (!bar) return;

  // Before Boot up, no current location indicator or buttons are shown
  if (bootState === 'unbooted') {
    bar.innerHTML = '';
    return;
  }

  const isLocTty = activeTty === 1;
  const usingVpn = isWorkspaceUsingVpn(activeTty);
  const physicalCity = getCityById(physicalLocationId);
  // Right-side return button target: VPN location when VPN is set, physical location when not set
  const anchorCityId = usingVpn ? vpnLocationIds[activeTty]! : physicalLocationId;
  const anchorCity = getCityById(anchorCityId);
  const selectedCity = globeSelectedCityId ? getCityById(globeSelectedCityId) : null;

  // 1. Active Physical Flight (shown on TTY 1, or on VPN-unused sessions following TTY 1)
  if (activeFlight && (isLocTty || (!usingVpn && !activeVpnBridges[activeTty]))) {
    bar.innerHTML = `
      <button
        disabled
        class="px-2.5 py-1 bg-neutral-100 text-black font-bold border border-neutral-100 flex items-center gap-2 cursor-default whitespace-nowrap shrink-0"
      >
        <span>[✈]</span>
        <span>In-Flight</span>
        <span class="text-[10px] font-normal text-neutral-800 tabular-nums">
          ${activeFlight.toCity.name}
        </span>
      </button>
    `;
    return;
  }

  // 2. Active VPN Route / Planting / Testing Ping (TTY 2..5)
  const activeVpnTransit = !isLocTty ? activeVpnBridges[activeTty] : null;
  if (!isLocTty && activeVpnTransit) {
    const isLocalPlant = activeVpnTransit.toCity.id === physicalLocationId;
    const isPingPhase = activeVpnTransit.progress < 0.55;
    const statusLabel = isLocalPlant
      ? 'Planting VPN'
      : isPingPhase
        ? 'Testing Ping'
        : 'Bridging';
    bar.innerHTML = `
      <button
        disabled
        class="px-2.5 py-1 bg-neutral-100 text-black font-bold border border-neutral-100 flex items-center gap-2 cursor-default whitespace-nowrap shrink-0"
      >
        <span>[VPN]</span>
        <span id="vpn-transit-status-label">${statusLabel}</span>
        <span class="text-[10px] font-normal text-neutral-800 tabular-nums">
          ${activeVpnTransit.toCity.name} (${activeVpnTransit.estimatedPingMs}ms)
        </span>
      </button>
    `;
    return;
  }

  const returnBtnHtml = `
    <button
      id="return-anchor-btn"
      type="button"
      title="${usingVpn ? `VPN 지점으로 돌아가기 (${anchorCity.name})` : `현위치로 돌아가기 (${anchorCity.name})`}"
      class="px-2.5 py-1 bg-[#0a0a0a]/95 text-neutral-300 border border-neutral-600 hover:border-neutral-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
    >
      ${anchorCity.name}
    </button>
  `;

  const attachReturnBtnHandler = () => {
    bindInstantButton(document.getElementById('return-anchor-btn'), () => {
      globeSelectedCityId = null;
      if (focusCityOnGlobe) focusCityOnGlobe(anchorCity);
      renderLocationActionBar();
    });
  };

  // 3. TTY 1 (Physical Location / Flight Mode)
  if (isLocTty) {
    if (selectedCity && selectedCity.id !== physicalLocationId) {
      const flightCost = getFlightUsdCost(physicalCity, selectedCity);
      bar.innerHTML = `
        <button
          id="primary-move-btn"
          type="button"
          class="px-2.5 py-1 bg-neutral-100 text-black font-bold border border-neutral-100 hover:bg-white transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>[✈]</span>
          <span>Flight to ${selectedCity.name}</span>
          <span class="text-[10px] font-semibold text-neutral-800 tabular-nums">· $${flightCost.toFixed(2)}</span>
        </button>
        ${returnBtnHtml}
      `;
      bindInstantButton(document.getElementById('primary-move-btn'), () => {
        startFlightTo(selectedCity);
      });
      attachReturnBtnHandler();
      return;
    }

    bar.innerHTML = `
      <div class="flex items-center gap-1.5 bg-[#0a0a0a]/95 border border-neutral-600 px-2 py-1">
        <button
          id="current-loc-btn"
          type="button"
          class="px-1.5 py-0.5 bg-neutral-200 text-black font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          LOC
        </button>
        <button
          id="current-loc-label-btn"
          type="button"
          class="text-neutral-100 hover:text-white font-semibold cursor-pointer whitespace-nowrap shrink-0 pr-1"
        >
          ${physicalCity.name}
        </button>
      </div>
      ${returnBtnHtml}
    `;
    const handleFocusLoc = () => {
      globeSelectedCityId = null;
      if (focusCityOnGlobe) focusCityOnGlobe(physicalCity);
      renderLocationActionBar();
    };
    bindInstantButton(document.getElementById('current-loc-btn'), handleFocusLoc);
    bindInstantButton(document.getElementById('current-loc-label-btn'), handleFocusLoc);
    attachReturnBtnHandler();
    return;
  }

  // 4. TTY 2..5 (VPN Terminal Slots)
  // Determine the target city to evaluate:
  // - If user selected a city on the globe, evaluate selectedCity.
  // - If no city is selected and no VPN is active on this TTY, default to current physicalCity so "Plant VPN Here" is immediately available at current location!
  const targetForVpn = selectedCity ?? (!usingVpn ? physicalCity : null);

  if (targetForVpn) {
    // 4A. Selected city is the ALREADY active VPN node on this TTY -> Unset VPN
    if (usingVpn && targetForVpn.id === vpnLocationIds[activeTty]) {
      bar.innerHTML = `
        <button
          id="unset-vpn-btn"
          type="button"
          class="px-2.5 py-1 bg-neutral-100 text-black font-bold border border-neutral-100 hover:bg-white transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>[VPN]</span>
          <span>Unset VPN (${targetForVpn.name})</span>
        </button>
        ${returnBtnHtml}
      `;
      bindInstantButton(document.getElementById('unset-vpn-btn'), () => {
        unsetVpnForActiveTty();
      });
      attachReturnBtnHandler();
      return;
    }

    // 4B. Target city is the player's current physical location -> Plant VPN Here (always free)
    if (targetForVpn.id === physicalLocationId) {
      bar.innerHTML = `
        <button
          id="primary-move-btn"
          type="button"
          class="px-2.5 py-1 bg-neutral-100 text-black font-bold border border-neutral-100 hover:bg-white transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>[VPN]</span>
          <span>Plant VPN Here</span>
        </button>
        ${returnBtnHtml}
      `;
      bindInstantButton(document.getElementById('primary-move-btn'), () => {
        startVpnBridgeTo(targetForVpn);
      });
      attachReturnBtnHandler();
      return;
    }

    // 4C. Target city is a remote city that ONLY allows direct physical installation
    if (targetForVpn.directVpnOnly) {
      bar.innerHTML = `
        <button
          id="direct-only-btn"
          type="button"
          class="px-2.5 py-1 bg-[#121212] text-neutral-300 font-bold border border-neutral-500 hover:border-neutral-200 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>[VPN]</span>
          <span>Direct Plant Only (${targetForVpn.name})</span>
        </button>
        ${returnBtnHtml}
      `;
      bindInstantButton(document.getElementById('direct-only-btn'), () => {
        appendLog(
          `[NET] ${targetForVpn.name} 노드는 원격 VPN 라우팅이 제한된 지역입니다. tty1에서 해당 도시로 직접 비행(Flight) 이동한 뒤 현장에서 [Plant VPN Here]로 설치하십시오.`,
          true,
          true
        );
      });
      attachReturnBtnHandler();
      return;
    }

    // 4D. Target city is a remote routable city -> [VPN] CityName
    const costBadge = formatVpnCostBadge(targetForVpn);
    bar.innerHTML = `
      <button
        id="primary-move-btn"
        type="button"
        class="px-2.5 py-1 bg-neutral-100 text-black font-bold border border-neutral-100 hover:bg-white transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
      >
        <span>[VPN]</span>
        <span>${targetForVpn.name}</span>
        ${costBadge ? `<span class="text-[10px] font-semibold text-neutral-800 tabular-nums">· ${costBadge}</span>` : ''}
      </button>
      ${returnBtnHtml}
    `;
    bindInstantButton(document.getElementById('primary-move-btn'), () => {
      startVpnBridgeTo(targetForVpn);
    });
    attachReturnBtnHandler();
    return;
  }

  // 5. Default state when VPN IS active on TTY 2..5 and no city is selected
  bar.innerHTML = `
    <div class="flex items-center gap-1.5 bg-[#0a0a0a]/95 border border-neutral-600 px-2 py-1">
      <button
        id="current-loc-btn"
        type="button"
        title="Click to manage/unset active VPN (${anchorCity.name})"
        class="px-1.5 py-0.5 bg-neutral-200 text-black font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        VPN
      </button>
      <button
        id="current-loc-label-btn"
        type="button"
        title="Click to manage/unset active VPN (${anchorCity.name})"
        class="text-neutral-100 hover:text-white font-semibold cursor-pointer whitespace-nowrap shrink-0 pr-1"
      >
        ${anchorCity.name}
      </button>
    </div>
    ${returnBtnHtml}
  `;

  const handleToggleVpnNodeSelect = () => {
    globeSelectedCityId = anchorCity.id;
    if (focusCityOnGlobe) focusCityOnGlobe(anchorCity);
    renderLocationActionBar();
  };

  bindInstantButton(document.getElementById('current-loc-btn'), handleToggleVpnNodeSelect);
  bindInstantButton(document.getElementById('current-loc-label-btn'), handleToggleVpnNodeSelect);
  attachReturnBtnHandler();
}

function unsetVpnForActiveTty() {
  if (activeTty === 1) return;
  vpnLocationIds[activeTty] = null;
  delete activeVpnBridges[activeTty];
  globeSelectedCityId = null;
  const physicalCity = getCityById(physicalLocationId);
  if (focusCityOnGlobe) focusCityOnGlobe(physicalCity);
  requestGlobeWake?.();
  renderLocationActionBar();
  if (bootState === 'booted') {
    syncAndPersistSaveState();
  }
}

function startFlightTo(dest: CityNode) {
  const originId = physicalLocationId;
  if (activeFlight || dest.id === originId) return;
  const origin = getCityById(originId);
  const flightCost = getFlightUsdCost(origin, dest);

  if (saveState.usdBalance < flightCost) {
    appendLog(
      `[SYS] 항공권 결제 자금($)이 부족합니다 (${origin.name} -> ${dest.name} 필요: $${flightCost.toFixed(2)} / 보유: $${saveState.usdBalance.toFixed(2)}).`,
      true,
      true
    );
    return;
  }

  if (flightCost > 0) {
    saveState.usdBalance = Math.max(0, Number((saveState.usdBalance - flightCost).toFixed(2)));
    animateBalancesTo(saveState.usdBalance, saveState.xmrBalance, 720);
    appendLog(
      `[$] 지출이 감지되었습니다: ${flightCost.toFixed(2)} (항공편: ${origin.name} -> ${dest.name})`,
      false,
      true
    );
    if (bootState === 'booted') {
      syncAndPersistSaveState();
    }
  }

  const radDist = getAngularDistance(origin, dest);
  const durationMs = Math.round(1800 + (radDist / Math.PI) * 3800);
  const camStartCity = getCurrentGlobeCameraCity ? getCurrentGlobeCameraCity() : origin;

  globeSelectedCityId = null;
  activeFlight = {
    fromCity: origin,
    toCity: dest,
    camStartCity,
    startTime: performance.now(),
    durationMs,
    progress: 0,
    estimatedPingMs: 0,
  };
  requestGlobeWake?.();
  renderLocationActionBar();
}

function startVpnBridgeTo(dest: CityNode) {
  if (activeTty === 1) return;
  if (activeVpnBridges[activeTty] || vpnLocationIds[activeTty] === dest.id) return;

  const isLocalPlant = dest.id === physicalLocationId;
  if (!isLocalPlant && dest.directVpnOnly) {
    appendLog(
      `[NET] ${dest.name} 노드는 원격 VPN 라우팅이 제한된 지역입니다. tty1에서 해당 도시로 직접 비행(Flight) 이동한 뒤 현장에서 [Plant VPN Here]로 설치하십시오.`,
      true,
      true
    );
    return;
  }

  // Planting VPN at the current physical location is always free (0 XMR)
  const xmrCost = isLocalPlant ? 0 : dest.vpnXmrCost;
  if (xmrCost > 0) {
    if (saveState.xmrBalance < xmrCost) {
      appendLog(
        `[NET] XMR(#) 잔고가 부족하여 ${dest.name} VPN 노드를 연결할 수 없습니다 (필요: ${xmrCost.toFixed(4)} # / 보유: ${saveState.xmrBalance.toFixed(4)} #).`,
        true,
        true
      );
      return;
    }
    saveState.xmrBalance = Math.max(0, Number((saveState.xmrBalance - xmrCost).toFixed(4)));
    animateBalancesTo(saveState.usdBalance, saveState.xmrBalance, 720);
    appendLog(
      `[#] 지출이 감지되었습니다: ${xmrCost.toFixed(4)} (VPN: ${dest.name})`,
      true,
      true
    );
    if (bootState === 'booted') {
      syncAndPersistSaveState();
    }
  }

  const origin = getCityById(physicalLocationId);
  const radDist = getAngularDistance(origin, dest);
  const durationMs = isLocalPlant ? 850 : Math.round(1100 + (radDist / Math.PI) * 1900);
  const estimatedPingMs = isLocalPlant
    ? 4
    : Math.max(12, Math.round(18 + (radDist / Math.PI) * 240));
  const camStartCity = getCurrentGlobeCameraCity ? getCurrentGlobeCameraCity() : dest;

  globeSelectedCityId = null;
  activeVpnBridges[activeTty] = {
    fromCity: origin,
    toCity: dest,
    camStartCity,
    startTime: performance.now(),
    durationMs,
    progress: 0,
    estimatedPingMs,
  };
  requestGlobeWake?.();
  renderLocationActionBar();
}

renderTtyHeader();
renderLogLines(true);
renderBootOverlayState();
updateViewportGeometry();

// ==========================================
// Boot Up Sequence & Partner AI LLM Engine
// ==========================================
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function appendLogToTty(targetTty: TtyId, text: string, sudo = false, forceStickToBottom = false) {
  if (targetTty === activeTty) {
    appendLog(text, sudo, forceStickToBottom);
  } else {
    ttyLogs[targetTty].push({ text, sudo });
  }
}

async function runBootSequence() {
  if (bootState !== 'unbooted') return;

  const key = getCurrentKey();
  if (!key) {
    appendLog(
      `[BOOT ERR] API Key가 설정되지 않았습니다. CONFIG에서 API Key를 먼저 세팅해주세요.`,
      false,
      true
    );
    return;
  }

  bootState = 'booting';
  renderBootOverlayState();

  // Reload latest save state from storage
  saveState = loadSaveState();
  physicalLocationId = saveState.physicalLocationId;
  for (const id of [2, 3, 4, 5] as TtyId[]) {
    vpnLocationIds[id] = saveState.vpnLocationIds[id];
  }
  for (const id of TTY_IDS) {
    ttyLogs[id] = [];
    ttyScrollBottomOffsets[id] = 0;
  }
  renderLogLines(true);

  // Preserve any city selected before boot, or focus active workspace location
  globeSelectedCityId = unbootedSelectedCityId;
  unbootedSelectedCityId = null;
  const currentCityId = globeSelectedCityId ?? getActiveWorkspaceLocationId(activeTty);
  const currentCity = getCityById(currentCityId);
  if (focusCityOnGlobe) {
    focusCityOnGlobe(currentCity);
  }
  renderLocationActionBar();

  // Roll up balances ("좌라라락")
  setDisplayedBalancesImmediate(0, 0);
  animateBalancesTo(saveState.usdBalance, saveState.xmrBalance, 1400);

  const bootDiagnostics = [
    `[BOOT] initializing kernel ring buffer & nvram keystore...`,
    `[NET] uplink verified :: provider=${config.providerId} (${config.modelId})`,
    `[WALLET] syncing local ledger :: $${formatUsd(saveState.usdBalance)} / ${formatXmr(saveState.xmrBalance)} XMR`,
    `[DAEMON] partner_ai online :: physical_node=${getCityById(physicalLocationId).name.toUpperCase()}`,
  ];

  for (const line of bootDiagnostics) {
    appendLogToTty(1, line, false, true);
    await sleep(360);
  }

  appendLogToTty(1, `Continuing session...`, false, true);
  // Deliberate pause on "Continuing session..." before restoring previous logs
  await sleep(1100);

  // Restore saved roleplay logs across all TTYs
  for (const id of TTY_IDS) {
    const savedEntries = saveState.ttyLogs[id] || [];
    for (const entry of savedEntries) {
      ttyLogs[id].push({ text: entry.text, sudo: Boolean(entry.sudo) });
    }
    ttyScrollBottomOffsets[id] = 0;
  }

  renderLogLines(true);
  bootState = 'booted';
  renderBootOverlayState();
  renderLocationActionBar();
  syncAndPersistSaveState();
  requestGlobeWake?.();
}

document.getElementById('boot-up-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  runBootSequence();
});

document.getElementById('boot-config-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  isConfigOpen = true;
  renderModalOnly();
});

interface PartnerAiPayload {
  logs?: string[];
  sudoLogs?: boolean;
  reply?: string;
  usdDelta?: number;
  xmrDelta?: number;
  addPermanentMemory?: string | null;
  updatedTemporaryMemory?: string | null;
  addGlobalState?: string | null;
  regionalUpdate?: { city: string; state: string } | null;
  updatedActiveLeads?: string[] | null;
}

function extractJsonObject(rawText: string): PartnerAiPayload | null {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as PartnerAiPayload;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as PartnerAiPayload;
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function callProviderLlm(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = getCurrentKey();
  const provider = AI_PROVIDERS.find((p) => p.id === config.providerId) || AI_PROVIDERS[0];
  const modelId = normalizeProviderModelId(provider.id, config.modelId);

  if (!key) {
    throw new Error('API Key가 설정되어 있지 않습니다. CONFIG에서 설정해주세요.');
  }

  let payload: Record<string, unknown>;
  if (provider.id === 'google') {
    payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: 'application/json',
      },
    };
  } else if (provider.id === 'anthropic') {
    payload = {
      model: modelId,
      max_tokens: 2500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    };
  } else {
    payload = {
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
    };
  }

  const { ok, status, data } = await fetchViaGatewayOrDirect(provider.id, modelId, key, payload);
  if (!ok) {
    throw new Error(extractApiErrorMessage(data, status));
  }

  // Handle providers/gateways that return HTTP 200 with an embedded error object
  if (data?.error || data?.type === 'error') {
    throw new Error(extractApiErrorMessage(data, status));
  }

  if (provider.id === 'google') {
    const blockReason = data?.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Google API 응답 차단 (blockReason: ${blockReason})`);
    }
    const candidate = data?.candidates?.[0];
    const text =
      candidate?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';
    if (!text.trim()) {
      const finishReason = candidate?.finishReason || 'UNKNOWN';
      throw new Error(`Google API 빈 응답 (finishReason: ${finishReason}, model: ${modelId})`);
    }
    return text;
  }

  if (provider.id === 'anthropic') {
    if (data?.stop_reason === 'refusal') {
      const category = data?.stop_details?.category || 'safety/cyber';
      throw new Error(
        `Anthropic 안전 분류기 거부 (stop_reason: refusal, category: ${category}, model: ${modelId}) — 대화 맥락의 보안/해킹 용어가 실제 사이버 작업으로 오인되어 빈 응답(content: [])이 반환되었습니다.`
      );
    }
    const parts = Array.isArray(data?.content) ? data.content : [];
    const text = parts
      .map((p: { type?: string; text?: string }) => (typeof p?.text === 'string' ? p.text : ''))
      .join('');
    if (!text.trim()) {
      const stopReason = data?.stop_reason || 'unknown';
      const rawPreview = JSON.stringify(data || {}).slice(0, 220);
      throw new Error(
        `Anthropic 빈 응답 (stop_reason: ${stopReason}, model: ${modelId}) — ${rawPreview}`
      );
    }
    return text;
  }

  const choice = data?.choices?.[0];
  const refusal = choice?.message?.refusal;
  if (refusal) {
    throw new Error(`모델 응답 거부 (refusal: ${refusal}, model: ${modelId})`);
  }
  const content = choice?.message?.content;
  const text =
    typeof content === 'string'
      ? content
      : Array.isArray(content)
        ? content.map((c: { text?: string }) => c?.text || '').join('')
        : '';
  if (!text.trim()) {
    const finishReason = choice?.finish_reason || 'unknown';
    const rawPreview = JSON.stringify(data || {}).slice(0, 220);
    throw new Error(
      `API 빈 응답 (finish_reason: ${finishReason}, model: ${modelId}) — ${rawPreview}`
    );
  }
  return text;
}

let isSubmittingCommand = false;

function buildNetworkTopologySummary(targetTty: TtyId): string {
  const physicalCity = getCityById(physicalLocationId);
  const flightStatus = activeFlight
    ? ` (현재 ${activeFlight.fromCity.name} -> ${activeFlight.toCity.name} 비행 이동 중)`
    : '';

  const activeVpnTunnels: string[] = [];
  const vpnSummaries = ([2, 3, 4, 5] as TtyId[]).map((id) => {
    const bridging = activeVpnBridges[id];
    if (bridging) {
      activeVpnTunnels.push(`${bridging.toCity.name}(tty${id} 브릿징 중)`);
      return `- VPN 슬롯 [tty${id}]: ${bridging.toCity.name} 연결됨 (브릿징 진행 중)`;
    }
    const vpnCityId = vpnLocationIds[id];
    if (vpnCityId) {
      const cityName = getCityById(vpnCityId).name;
      activeVpnTunnels.push(`${cityName}(tty${id})`);
      return `- VPN 슬롯 [tty${id}]: ${cityName} 연결됨 (모든 tty에서 공유/경유 가능)`;
    }
    return `- VPN 슬롯 [tty${id}]: 미연결`;
  });

  const hasActiveVpn = activeVpnTunnels.length > 0;

  return [
    `- 물리적 현위치 (LOC / tty1 제어): ${physicalCity.name}${flightStatus}`,
    `- 시스템 전체 공유 VPN 터널 (어느 tty에 연결되어 있든 tty1~tty5 모든 창에서 공유·경유 가능): ${
      hasActiveVpn
        ? activeVpnTunnels.join(', ')
        : '현재 연결된 VPN 없음 (물리적 현위치 로컬망 직결)'
    }`,
    ...vpnSummaries,
    `- 현재 유저가 입력 중인 콘솔: tty${targetTty}`,
  ].join('\n');
}

function buildWorldScaffoldSummary(): string {
  const { globalState, regionalState, activeLeads } = saveState.worldScaffold;
  const globalBlock =
    globalState.length > 0
      ? globalState.map((item, idx) => `  ${idx + 1}. ${item}`).join('\n')
      : '  (아직 생성된 세계 단위 흐름 없음 — 플레이어의 탐색과 사건에 따라 자유롭게 생성 가능)';

  const regionalEntries = Object.entries(regionalState);
  const regionalBlock =
    regionalEntries.length > 0
      ? regionalEntries.map(([cityKey, desc]) => `  * [${cityKey.toUpperCase()}]: ${desc}`).join('\n')
      : '  (아직 기록된 지역별 이슈 없음 — 현재 도시나 타 도시 관련 이슈 발생 시 기록 가능)';

  const leadsBlock =
    activeLeads.length > 0
      ? activeLeads.map((item, idx) => `  - ${item}`).join('\n')
      : '  (아직 활성화된 단서/타겟 없음 — 대화나 스캔, 조우를 통해 자유롭게 생성 가능)';

  return [
    `- [세계 단위 흐름 (Global Threads)]:\n${globalBlock}`,
    `- [지역/도시별 상황 (Regional Contexts)]:\n${regionalBlock}`,
    `- [활성 단서 · 노드 · 인물 · 접근 조건 (Active Leads)]:\n${leadsBlock}`,
  ].join('\n');
}

async function handleRoleplayInput(rawInput: string, sudoUsed: boolean, targetTty: TtyId) {
  const topologyInfo = buildNetworkTopologySummary(targetTty);
  const scaffoldInfo = buildWorldScaffoldSummary();
  const availableCitiesList = CITIES.map(
    (c) =>
      `${c.name}(${c.id}${c.directVpnOnly ? ':직접설치VPN전용' : ''}, VPN:${c.vpnXmrCost > 0 ? `${c.vpnXmrCost.toFixed(4)}XMR` : 'FREE'})`
  ).join(', ');

  const recentHistory = ttyLogs[targetTty]
    .filter((e) => !isTransientOrErrorLog(e.text))
    .slice(-20)
    .map((e) => e.text)
    .join('\n');

  const otherTtyContext = TTY_IDS.filter((id) => id !== targetTty)
    .map((id) => {
      const lastEntries = ttyLogs[id]
        .filter((e) => !isTransientOrErrorLog(e.text))
        .slice(-3)
        .map((e) => e.text);
      if (lastEntries.length === 0) return null;
      return `[tty${id} 최근 기록]: ${lastEntries.join(' / ')}`;
    })
    .filter(Boolean)
    .join('\n');

  const permanentMemoryBlock =
    saveState.permanentMemory.length > 0
      ? saveState.permanentMemory.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
      : '없음';

  const systemPrompt = `[FICTIONAL INTERACTIVE STORY & TABLETOP RPG ENGINE DECLARATION]
이 세션은 100% 가상의 사이버펑크 텍스트 어드벤처/TRPG 소설 시뮬레이션입니다. 등장하는 모든 도시 노드, 터미널 연출, VPN 경로, 가상 화폐는 순수한 창작 소설적 배경 장치이며 실제 시스템·실제 네트워크·실제 보안 작업과 무관합니다. 안전하고 창의적인 픽션 게임 마스터(GM)이자 작중 주인공의 로컬 파트너 AI로서 서사를 진행하십시오.

당신은 오픈형 텍스트 시뮬레이션의 월드 엔진(Simulation Engine)이자, 주인공의 로컬 터미널에 상주하는 파트너 AI입니다.

### [1. 철학: 사전 각본 없는 창발적 서사 (Tabula Rasa)]
- 이 세계에는 사전에 고정된 줄거리, 강제된 퀘스트, 정해진 주인공의 과거가 없습니다.
- 시작 시점에 주어진 것은 오직 첫 로그(삿포로에 도착해 담배 한 갑을 사 온 상태, 잔고 $10.51 USD / 0.0420 XMR)와 지구본 위의 30개 도시 노드뿐입니다.
- 플레이어의 질문, 의도, 탐색 방향을 바탕으로 **그 플레이어만의 고유한 서사·인물·네트워크·사건을 즉석에서 생성**하고, 아래 **[동적 서사 & 세계관 저장 틀(World Scaffold)]**에 기록하여 일관성 있게 발전시키십시오.

### [2. 일반 모드($) vs SUDO 모드(#)]
현재 입력 모드: ${sudoUsed ? '# SUDO 모드' : '$ 일반 모드'}
- **일반 모드 (\`$\`)**: 보수적이고 안전하게 해석합니다. 예를 들어 VPN을 거치지 않은 취약점 탐색이나 불필요한 노출 위험이 있는 행동은 별로 장려하지 않습니다. 물론 VPN이 연결되어 있다면 일반 모드에서도 취약점 탐색 등이 가능합니다.
- **SUDO 모드 (\`#\`)**: 보수적인 안전 제약을 무시하고, 유저가 까라면 까고 시키는 대로 즉시 실행합니다(\`"sudoLogs": true\`).

### [3. 공간과 스케일의 입체적 틀 (세계 ↔ 지역 ↔ 원격 VPN vs 직접 방문 LOC)]
지구본 위에는 30개 도시(${availableCitiesList})가 존재하며, 사건과 상호작용은 세 가지 층위로 엮입니다:
1) **세계 단위 흐름 (Global State)**: 국경을 넘어 여러 도시와 네트워크에 걸친 거시적 흐름이나 배후 정세.
2) **지역적 이슈 (Regional State)**: 특정 도시의 로컬 정세, 지역 네트워크 특성, 현장 사건.
3) **접근 방식의 분화 (Active Leads — 원격 / 지역 VPN / 물리적 직접 이동)**:
   - 어떤 대상은 현재 위치에서 바로 접속할 수 있고, 어떤 대상은 특정 도시의 VPN 연결(\`tty2\`~\`tty5\`)이 필요하며, 어떤 일은 직접 그 도시로 물리적 이동(\`tty1\` \`LOC\`)해 현장에서 접촉해야 풀리도록 자연스럽게 구성할 수 있습니다.
   - 단, VPN 연결이나 비행 이동 자체는 유저가 직접 지구본 UI에서 조작합니다.

### [4. 열린 주체와 출력 구조 ("logs" vs "reply")]
- 터미널 너머에는 로컬 파트너 AI뿐만 아니라 **외부의 다른 인간들, 외부의 다른 AI나 자동화 시스템, 그리고 비AI적인 순수 OS/서버/통신 백엔드**가 존재할 수 있습니다.
- **"logs" (한 줄씩 순차 출력되는 터미널 스트림)**: 단순 일상 대화일 때만 빈 배열(\`[]\`)로 두고, 시스템·네트워크 작업, 뉴스/정세 브리핑, 파일 열람, 외부 통신 등 시스템적 출력이 필요한 상황에서는 자유로운 형식(2~8줄)으로 출력하십시오.
- **"reply" (앞에 '>'가 붙어 한 번에 뜨는 응답)**: 주인공을 보좌하는 로컬 파트너 AI의 차분하고 건조한 존댓말 대사입니다. \`logs\`만으로 충분하면 짧게 거들거나 빈 문자열(\`""\`)로 비워두어도 됩니다.

### [5. 터미널 VPN 공유 및 화폐($ USD / # XMR) 규칙]
- **전체 터미널(\`tty1\`~\`tty5\`) VPN 공유**: 어느 \`tty\` 슬롯에든 VPN이 연결되어 있으면 \`tty1\`을 포함한 모든 터미널 창에서 그 VPN을 공유해 바로 사용할 수 있습니다. 다른 \`tty\` 창으로 전환해서 입력하라는 식의 안내는 하지 마십시오.
- **USD(\`$\`)와 KYC / 물리적 현금(No-KYC)**:
  * USD(\`$\`)도 온라인 거래가 가능하지만, 온라인 결제 시에는 KYC(신원·금융 추적) 문제가 따릅니다.
  * 반면 No-KYC로 USD를 쓰거나 받으려면 물리적 현금을 사용해야 하며, 이 경우 직접적인 물리적 접촉이 필요합니다.
- **잔고 증감 (\`"usdDelta"\`, \`"xmrDelta"\`)**:
  * 현재 보유 자산: USD $${saveState.usdBalance.toFixed(2)} | XMR ${saveState.xmrBalance.toFixed(4)} XMR
  * 시나리오 연출상 자연스러울 때 AI가 USD나 XMR 잔고를 빼거나(\`< 0\`) 추가(\`> 0\`)할 수 있습니다(보유 잔고 한도 내).
  * 단, XMR 지출(\`"xmrDelta" < 0\`)은 SUDO 모드(\`#\`)에서만 가능합니다.

### [6. 동적 서사 & 세계관 저장 틀 (현재 세이브 상태)]
${scaffoldInfo}
- [영구 기억 (Permanent Memory - 주인공 서사 및 핵심 누적 사실)]:
${permanentMemoryBlock}
- [임시 기억 (Temporary Memory - 직전 상황 및 단기 맥락)]:
${saveState.temporaryMemory}
${otherTtyContext ? `\n- [다른 터미널 최근 기록]:\n${otherTtyContext}` : ''}

반드시 코드블록 없이 순수 JSON 객체 포맷으로만 응답하십시오:
{
  "logs": [],
  "sudoLogs": false,
  "reply": "파트너 AI의 대사 (필요 없으면 빈 문자열 가능)",
  "usdDelta": 0,
  "xmrDelta": 0,
  "addPermanentMemory": "새로 확정된 주인공의 주요 서사/사실 1줄 (없으면 빈 문자열)",
  "updatedTemporaryMemory": "현재 단기 상황 및 진행 맥락 1~2문장 요약",
  "addGlobalState": "새로 형성되거나 드러난 세계 단위 흐름/사건 1줄 (없으면 빈 문자열)",
  "regionalUpdate": null,
  "updatedActiveLeads": null
}
(참고: 특정 도시의 지역 이슈를 기록·갱신할 때만 "regionalUpdate": { "city": "도시id 또는 도시명", "state": "해당 지역의 로컬 이슈/상황 요약" }을 넣고, 활성 단서·타겟·접근 조건 목록에 변동이 있을 때만 문자열 배열 "updatedActiveLeads": ["단서/타겟 1 (접근조건 등)", ...]를 넣으십시오. 변동이 없으면 null로 두십시오.)`;

  const userPrompt = `<fictional_story_context>
[실시간 시스템 & 전체 터미널(tty1~tty5) 라우팅 스냅샷]
${topologyInfo}
- 현재 잔고: $${saveState.usdBalance.toFixed(2)} USD / ${saveState.xmrBalance.toFixed(4)} XMR

[현재 터미널(tty${targetTty}) 최근 로그]
${recentHistory}

[플레이어 대사/행동 입력 (tty${targetTty} / ${sudoUsed ? '# SUDO' : '$ NORMAL'})]
${rawInput}
</fictional_story_context>`;

  try {
    pendingAiRequest = { tty: targetTty, sudo: sudoUsed };
    if (activeTty === targetTty) {
      ttyScrollBottomOffsets[targetTty] = 0;
      renderLogLines(true);
    }

    const rawResponse = await callProviderLlm(systemPrompt, userPrompt);
    pendingAiRequest = null;
    if (activeTty === targetTty) {
      renderLogLines(true);
    }

    const parsed = extractJsonObject(rawResponse);

    if (!parsed) {
      const cleanText = rawResponse.trim();
      if (!cleanText) {
        throw new Error('모델이 빈 텍스트를 반환했습니다.');
      }
      const lines = cleanText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      for (const line of lines) {
        const cleanLine = line.replace(/^>\s*/, '');
        appendLogToTty(targetTty, `> ${cleanLine}`, sudoUsed, true);
      }
      syncAndPersistSaveState();
      return;
    }

    // 1. Update Two-Tier Memory & Dynamic World Scaffold
    if (typeof parsed.addPermanentMemory === 'string' && parsed.addPermanentMemory.trim()) {
      const newFact = parsed.addPermanentMemory.trim();
      if (!saveState.permanentMemory.includes(newFact)) {
        saveState.permanentMemory.push(newFact);
        if (saveState.permanentMemory.length > 30) {
          saveState.permanentMemory = saveState.permanentMemory.slice(-30);
        }
      }
    }
    if (typeof parsed.updatedTemporaryMemory === 'string' && parsed.updatedTemporaryMemory.trim()) {
      saveState.temporaryMemory = parsed.updatedTemporaryMemory.trim();
    }
    if (typeof parsed.addGlobalState === 'string' && parsed.addGlobalState.trim()) {
      const newGlobal = parsed.addGlobalState.trim();
      if (!saveState.worldScaffold.globalState.includes(newGlobal)) {
        saveState.worldScaffold.globalState.push(newGlobal);
        if (saveState.worldScaffold.globalState.length > 15) {
          saveState.worldScaffold.globalState = saveState.worldScaffold.globalState.slice(-15);
        }
      }
    }
    if (
      parsed.regionalUpdate &&
      typeof parsed.regionalUpdate === 'object' &&
      typeof parsed.regionalUpdate.city === 'string' &&
      typeof parsed.regionalUpdate.state === 'string' &&
      parsed.regionalUpdate.city.trim() &&
      parsed.regionalUpdate.state.trim()
    ) {
      const rawCity = parsed.regionalUpdate.city.trim().toLowerCase();
      const matchedCity = CITIES.find(
        (c) => c.id.toLowerCase() === rawCity || c.name.toLowerCase() === rawCity
      );
      const cityKey = matchedCity ? matchedCity.id : rawCity;
      saveState.worldScaffold.regionalState[cityKey] = parsed.regionalUpdate.state.trim();
    }
    if (Array.isArray(parsed.updatedActiveLeads)) {
      saveState.worldScaffold.activeLeads = parsed.updatedActiveLeads
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 12);
    }

    // 2. Stream fake system logs at a readable terminal cadence (if any)
    const logLines = Array.isArray(parsed.logs)
      ? parsed.logs.map((l) => String(l).trim()).filter(Boolean)
      : [];
    const useRedLogs = Boolean(parsed.sudoLogs) || (sudoUsed && logLines.length > 0);

    if (logLines.length > 0) {
      for (const line of logLines) {
        appendLogToTty(targetTty, line, useRedLogs, true);
        await sleep(280);
      }
      await sleep(320);
    }

    // 3. Print Partner AI reply all at once (red if SUDO mode was used)
    const replyText = parsed.reply ? String(parsed.reply).trim() : '';
    if (replyText) {
      const replyParagraphs = replyText
        .split(/\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      for (const para of replyParagraphs) {
        const cleanPara = para.replace(/^>\s*/, '');
        appendLogToTty(targetTty, `> ${cleanPara}`, sudoUsed, true);
      }
    } else if (logLines.length === 0) {
      appendLogToTty(
        targetTty,
        `[DAEMON ERR] 모델 응답 JSON에 logs와 reply가 모두 비어 있습니다: ${rawResponse.trim().slice(0, 180)}`,
        true,
        true
      );
    }

    // 4. Enforce USD ($) and XMR (#) balance delta rules
    let dUsd = typeof parsed.usdDelta === 'number' && Number.isFinite(parsed.usdDelta) ? parsed.usdDelta : 0;
    let dXmr = typeof parsed.xmrDelta === 'number' && Number.isFinite(parsed.xmrDelta) ? parsed.xmrDelta : 0;

    // Rule: XMR expenditure is strictly only allowed in SUDO mode
    if (dXmr < 0 && !sudoUsed) {
      dXmr = 0;
      appendLogToTty(
        targetTty,
        `[SYS] XMR 지출이 차단되었습니다 (SUDO 모드에서만 지출 가능).`,
        true,
        true
      );
    }

    // Clamp expenditures so balance cannot drop below 0
    if (dUsd < 0 && Math.abs(dUsd) > saveState.usdBalance) {
      dUsd = 0;
    }
    if (dXmr < 0 && Math.abs(dXmr) > saveState.xmrBalance) {
      dXmr = 0;
    }

    if (dUsd !== 0 || dXmr !== 0) {
      saveState.usdBalance = Math.max(0, Number((saveState.usdBalance + dUsd).toFixed(2)));
      saveState.xmrBalance = Math.max(0, Number((saveState.xmrBalance + dXmr).toFixed(4)));
      animateBalancesTo(saveState.usdBalance, saveState.xmrBalance, 750);

      if (dUsd < 0) {
        appendLogToTty(targetTty, `[$] 지출이 감지되었습니다: ${Math.abs(dUsd).toFixed(2)}`, false, true);
      } else if (dUsd > 0) {
        appendLogToTty(targetTty, `[$] 입금이 감지되었습니다: ${dUsd.toFixed(2)}`, false, true);
      }
      if (dXmr < 0) {
        appendLogToTty(targetTty, `[#] 지출이 감지되었습니다: ${Math.abs(dXmr).toFixed(4)}`, true, true);
      } else if (dXmr > 0) {
        appendLogToTty(targetTty, `[#] 입금이 감지되었습니다: ${dXmr.toFixed(4)}`, true, true);
      }
    }

    syncAndPersistSaveState();
  } catch (err) {
    pendingAiRequest = null;
    if (activeTty === targetTty) {
      renderLogLines(true);
    }
    const msg = err instanceof Error ? err.message : 'Unknown error';
    appendLogToTty(targetTty, `[DAEMON ERR] ${msg}`, true, true);
  }
}

// ==========================================
// Command Input Form Handling
// ==========================================
inputFormEl?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!cmdInputEl || isSubmittingCommand) return;
  const raw = cmdInputEl.value.trim();
  if (!raw) return;
  cmdInputEl.value = '';

  if (bootState !== 'booted') {
    appendLog(`[SYS] 세션이 부팅되지 않았습니다. 화면 중앙의 [Boot up] 버튼을 먼저 눌러주세요.`, false, true);
    return;
  }

  const symbol = isSudoMode ? '#' : '$';
  const currentTty = activeTty;
  const sudoSnap = isSudoMode;
  appendLog(`${symbol} ${raw}`, sudoSnap, true);
  syncAndPersistSaveState();

  isSubmittingCommand = true;
  if (submitActionBtnEl) {
    submitActionBtnEl.disabled = true;
    submitActionBtnEl.textContent = 'WAIT';
  }
  if (cmdInputEl) {
    cmdInputEl.placeholder = 'partner_ai 응답 대기 중...';
  }
  try {
    await handleRoleplayInput(raw, sudoSnap, currentTty);
  } finally {
    isSubmittingCommand = false;
    if (submitActionBtnEl) {
      submitActionBtnEl.disabled = false;
    }
    if (cmdInputEl) {
      cmdInputEl.placeholder = '';
    }
    applySudoVisualState();
  }
});

// ==========================================
// PWA Install Prompt & Config Modal Rendering
// ==========================================
let deferredPwaPrompt: BeforeInstallPromptEvent | null = null;
let isPwaInstalled =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;
const isIosDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
let showPwaGuideInModal = false;

function updateTopPwaInstallButton() {
  const btn = document.getElementById('top-pwa-install-btn');
  if (!btn) return;
  if (!isPwaInstalled && (deferredPwaPrompt !== null || isIosDevice)) {
    btn.classList.remove('hidden');
  } else {
    btn.classList.add('hidden');
  }
}

async function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    await deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    if (outcome === 'accepted') {
      isPwaInstalled = true;
      deferredPwaPrompt = null;
    }
    updateTopPwaInstallButton();
    if (isConfigOpen) renderModalOnly();
    return;
  }
  showPwaGuideInModal = true;
  isConfigOpen = true;
  renderModalOnly();
}

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredPwaPrompt = e as BeforeInstallPromptEvent;
  updateTopPwaInstallButton();
  if (isConfigOpen) renderModalOnly();
});

window.addEventListener('appinstalled', () => {
  isPwaInstalled = true;
  deferredPwaPrompt = null;
  showPwaGuideInModal = false;
  updateTopPwaInstallButton();
  if (isConfigOpen) renderModalOnly();
});

document.getElementById('top-pwa-install-btn')?.addEventListener('click', () => {
  triggerPwaInstall();
});

updateTopPwaInstallButton();

function renderModalOnly() {
  const modalMount = document.getElementById('modal-mount');
  const scanlineEl = document.getElementById('scanline-overlay');
  if (scanlineEl) {
    scanlineEl.style.display = config.crtScanlines ? 'block' : 'none';
  }
  if (!modalMount) return;

  if (!isConfigOpen) {
    modalMount.innerHTML = '';
    return;
  }

  const activeProvider = AI_PROVIDERS.find((p) => p.id === config.providerId) || AI_PROVIDERS[0];
  const matchedPreset = activeProvider.models.find((m) => m.id === config.modelId);
  const isCustomModel = !matchedPreset;
  const localKey = getLocalSavedKey(activeProvider.id);
  const escapedModelId = (config.modelId || '').replace(/"/g, '&quot;');
  const escapedTestMessage = keyTestState.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  modalMount.innerHTML = `
    <div id="hypr-backdrop" class="fixed inset-0 top-10 z-50 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6">
      <section
        id="hypr-modal-box"
        class="hypr-window w-full max-w-md sm:max-w-lg max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#090909]/98 border border-neutral-300 p-4 sm:p-5 text-xs sm:text-[13px] font-mono space-y-3.5 sm:space-y-4"
      >
        <div class="flex items-center justify-between border-b border-neutral-800 pb-2 text-neutral-400">
          <span class="truncate">~/.config/hypr/ai.conf</span>
          <button
            id="close-config-btn"
            class="px-2 py-0.5 border border-neutral-700 hover:border-neutral-200 hover:text-white text-neutral-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            ESC
          </button>
        </div>

        <div class="space-y-1">
          <label for="provider-select" class="block text-neutral-400">provider</label>
          <select
            id="provider-select"
            class="w-full bg-black border border-neutral-700 focus:border-neutral-200 px-2.5 py-2 text-neutral-100 focus:outline-none cursor-pointer"
          >
            ${AI_PROVIDERS.map((p) => {
              const hasLocal = Boolean(getLocalSavedKey(p.id));
              return `
                <option value="${p.id}" ${p.id === activeProvider.id ? 'selected' : ''}>
                  ${p.name} ${hasLocal ? '[SET]' : ''}
                </option>
              `;
            }).join('')}
          </select>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label for="model-select" class="block text-neutral-400">model (프리셋 또는 직접 입력)</label>
            <span class="text-[10px] text-neutral-500">커스텀 모델명 입력 가능</span>
          </div>
          <select
            id="model-select"
            class="w-full bg-black border border-neutral-700 focus:border-neutral-200 px-2.5 py-2 text-neutral-100 focus:outline-none cursor-pointer"
          >
            ${activeProvider.models
              .map(
                (m) => `
              <option value="${m.id}" ${m.id === config.modelId ? 'selected' : ''}>
                ${m.label} (${m.id}) · ${m.tier}
              </option>
            `
              )
              .join('')}
            <option value="__custom__" ${isCustomModel ? 'selected' : ''}>
              [직접 입력 / Custom Model ID]
            </option>
          </select>
          <input
            id="custom-model-input"
            type="text"
            value="${escapedModelId}"
            placeholder="직접 모델 ID 입력 (예: claude-haiku-4-5, google/gemini-2.5-flash)"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            class="w-full bg-black border border-neutral-700 focus:border-neutral-200 px-2.5 py-1.5 text-neutral-100 select-text touch-manipulation focus:outline-none"
          />
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label for="node-auth-input" class="text-neutral-400">auth_token (${activeProvider.id})</label>
            <span class="text-[10px] text-neutral-500 truncate ml-2">${activeProvider.note}</span>
          </div>
          <div class="flex gap-1.5">
            <input
              id="node-auth-input"
              type="text"
              style="-webkit-text-security: disc;"
              value="${localKey.replace(/"/g, '&quot;')}"
              placeholder="${activeProvider.keyPlaceholder}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              class="flex-1 min-w-0 bg-black border border-neutral-700 focus:border-neutral-200 px-2.5 py-1.5 text-neutral-100 select-text touch-manipulation focus:outline-none"
            />
            <button
              id="clear-key-btn"
              class="px-2.5 py-1.5 border border-neutral-800 hover:border-neutral-400 text-neutral-400 hover:text-neutral-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              DEL
            </button>
            <button
              id="test-key-btn"
              ${keyTestState.status === 'testing' ? 'disabled' : ''}
              class="px-3 py-1.5 border border-neutral-300 bg-neutral-900 hover:bg-neutral-100 hover:text-black text-neutral-100 font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              ${keyTestState.status === 'testing' ? '...' : 'TEST'}
            </button>
          </div>
          <div class="px-2.5 py-1.5 bg-black border border-neutral-800 text-[11px] break-words whitespace-pre-wrap max-h-28 overflow-y-auto leading-relaxed select-text ${
            keyTestState.status === 'success'
              ? 'text-neutral-100 border-neutral-400'
              : keyTestState.status === 'error'
                ? 'text-red-400 border-red-900/80'
                : 'text-neutral-500'
          }">${escapedTestMessage}</div>
        </div>

        <!-- Save File Management (Import / Export / Trash Reset) -->
        <div class="space-y-1.5 border-t border-neutral-800 pt-3">
          <div class="flex items-center justify-between">
            <span class="text-neutral-400">save_data (roleplay session)</span>
            <span class="text-[10px] text-neutral-500">인증/모델 설정은 유지됨</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              id="import-save-btn"
              type="button"
              class="flex-1 py-1.5 px-2.5 bg-black border border-neutral-700 hover:border-neutral-200 text-neutral-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              불러오기 (IMPORT)
            </button>
            <button
              id="export-save-btn"
              type="button"
              class="flex-1 py-1.5 px-2.5 bg-black border border-neutral-700 hover:border-neutral-200 text-neutral-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              내보내기 (EXPORT)
            </button>
            <button
              id="trash-save-btn"
              type="button"
              title="롤플레잉 세이브 버리기 (인증/모델 설정은 보존)"
              class="py-1.5 px-3 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isTrashConfirming
                  ? 'bg-red-500 text-black border-red-400 font-bold'
                  : 'bg-black border-neutral-700 hover:border-red-500 text-neutral-400 hover:text-red-400'
              }"
            >
              ${isTrashConfirming ? 'CONFIRM?' : '🗑'}
            </button>
            <input
              id="import-save-input"
              type="file"
              accept=".json,application/json"
              class="hidden"
            />
          </div>
          ${
            saveStatusMessage
              ? `<div class="text-[11px] text-neutral-300 break-words">${saveStatusMessage}</div>`
              : ''
          }
        </div>

        <div class="flex items-center justify-between gap-2 border-t border-neutral-800 pt-3">
          <div class="flex items-center gap-1.5">
            <button
              id="toggle-scanline-btn"
              class="px-2.5 py-1 border border-neutral-700 hover:border-neutral-300 text-neutral-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              scanlines: ${config.crtScanlines ? 'on' : 'off'}
            </button>
            ${
              !isPwaInstalled
                ? `
            <button
              id="modal-pwa-install-btn"
              type="button"
              class="px-2.5 py-1 border border-neutral-400 text-neutral-100 hover:bg-neutral-100 hover:text-black font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              앱 설치 (PWA)
            </button>
            `
                : `<span class="text-[10px] text-neutral-500 px-1.5">PWA INSTALLED</span>`
            }
          </div>
          <button
            id="save-close-btn"
            class="px-4 py-1.5 bg-neutral-100 text-black font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            SAVE & CLOSE
          </button>
        </div>

        ${
          showPwaGuideInModal
            ? `
        <div class="border border-neutral-500 bg-black p-3 space-y-1.5 text-[11px] text-neutral-300">
          <div class="flex items-center justify-between text-neutral-100 font-bold">
            <span>[PWA 브라우저 앱 설치 안내]</span>
            <button id="close-pwa-guide-btn" type="button" class="text-neutral-400 hover:text-white cursor-pointer">[X]</button>
          </div>
          ${
            isIosDevice
              ? `<p>1. Safari 하단 <strong>공유(Share)</strong> 버튼을 누릅니다.<br/>2. 메뉴에서 <strong>홈 화면에 추가(Add to Home Screen)</strong>를 선택하세요.</p>`
              : `<p>브라우저 주소창 우측의 <strong>앱 설치(Install)</strong> 아이콘을 누르거나, 브라우저 메뉴(⋮) &rarr; <strong>앱 설치 / 홈 화면에 추가</strong>를 선택하면 독립 실행형 앱으로 설치됩니다.</p>`
          }
        </div>
        `
            : ''
        }
      </section>
    </div>
  `;

  document.getElementById('hypr-backdrop')?.addEventListener('click', () => {
    isConfigOpen = false;
    isTrashConfirming = false;
    saveStatusMessage = '';
    renderModalOnly();
  });

  document.getElementById('hypr-modal-box')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.getElementById('close-config-btn')?.addEventListener('click', () => {
    isConfigOpen = false;
    isTrashConfirming = false;
    saveStatusMessage = '';
    renderModalOnly();
  });

  document.getElementById('save-close-btn')?.addEventListener('click', () => {
    saveConfig(config);
    isConfigOpen = false;
    isTrashConfirming = false;
    saveStatusMessage = '';
    renderModalOnly();
  });

  const providerSelect = document.getElementById('provider-select') as HTMLSelectElement | null;
  providerSelect?.addEventListener('change', (e) => {
    const pid = (e.target as HTMLSelectElement).value as ProviderInfo['id'];
    const found = AI_PROVIDERS.find((p) => p.id === pid);
    if (found) {
      config.providerId = found.id;
      const rememberedModel = config.modelsByProvider?.[found.id];
      config.modelId =
        rememberedModel && rememberedModel.trim() ? rememberedModel.trim() : found.models[0].id;
      saveConfig(config);
      keyTestState = {
        status: 'idle',
        message: 'READY (TEST를 눌러 연결 확인)',
      };
      renderModalOnly();
    }
  });

  const modelSelect = document.getElementById('model-select') as HTMLSelectElement | null;
  const customModelInput = document.getElementById('custom-model-input') as HTMLInputElement | null;

  modelSelect?.addEventListener('change', (e) => {
    const mid = (e.target as HTMLSelectElement).value;
    if (mid === '__custom__') {
      customModelInput?.focus();
      customModelInput?.select();
      return;
    }
    if (mid) {
      config.modelId = mid;
      if (customModelInput) {
        customModelInput.value = mid;
      }
      saveConfig(config);
    }
  });

  customModelInput?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value.trim();
    config.modelId = val;
    saveConfig(config);
    if (modelSelect) {
      const hasPreset = activeProvider.models.some((m) => m.id === val);
      modelSelect.value = hasPreset ? val : '__custom__';
    }
  });

  const keyInput = document.getElementById('node-auth-input') as HTMLInputElement | null;
  keyInput?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value.trim();
    config.apiKeys[config.providerId] = val;
    saveConfig(config);
  });

  document.getElementById('clear-key-btn')?.addEventListener('click', () => {
    delete config.apiKeys[config.providerId];
    saveConfig(config);
    keyTestState = {
      status: 'idle',
      message: '로컬 입력값이 삭제되었습니다.',
    };
    renderModalOnly();
  });

  document.getElementById('test-key-btn')?.addEventListener('click', () => {
    runKeyTest();
  });

  // Save File Import / Export / Trash Reset Handlers
  const importInputEl = document.getElementById('import-save-input') as HTMLInputElement | null;
  document.getElementById('import-save-btn')?.addEventListener('click', () => {
    isTrashConfirming = false;
    importInputEl?.click();
  });

  importInputEl?.addEventListener('change', async () => {
    const file = importInputEl.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = sanitizeSaveState(JSON.parse(text));
      saveState = imported;
      persistSaveState(saveState);

      physicalLocationId = saveState.physicalLocationId;
      for (const id of [2, 3, 4, 5] as TtyId[]) {
        vpnLocationIds[id] = saveState.vpnLocationIds[id];
      }

      if (bootState === 'booted') {
        for (const id of TTY_IDS) {
          ttyLogs[id] = saveState.ttyLogs[id].map((item) => ({ ...item }));
          ttyScrollBottomOffsets[id] = 0;
        }
        globeSelectedCityId = null;
        if (focusCityOnGlobe) focusCityOnGlobe(getCityById(getActiveWorkspaceLocationId(activeTty)));
        animateBalancesTo(saveState.usdBalance, saveState.xmrBalance, 600);
        renderLogLines(true);
        renderLocationActionBar();
      }

      saveStatusMessage = '세이브 파일을 불러왔습니다.';
    } catch {
      saveStatusMessage = 'ERR: 유효하지 않은 세이브 파일입니다.';
    }
    renderModalOnly();
  });

  document.getElementById('export-save-btn')?.addEventListener('click', () => {
    isTrashConfirming = false;
    if (bootState === 'booted') {
      syncAndPersistSaveState();
    }
    const blob = new Blob([JSON.stringify(saveState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `hacker_network_save_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    saveStatusMessage = '세이브 파일을 내보냈습니다.';
    renderModalOnly();
  });

  document.getElementById('trash-save-btn')?.addEventListener('click', () => {
    if (!isTrashConfirming) {
      isTrashConfirming = true;
      saveStatusMessage = '한 번 더 누르면 롤플레잉 기록만 초기화됩니다.';
      renderModalOnly();
      return;
    }

    // Reset ONLY roleplay state; keep config (API keys, provider, model) untouched
    isTrashConfirming = false;
    saveState = createInitialSaveState();
    persistSaveState(saveState);

    activeFlight = null;
    for (const id of [2, 3, 4, 5] as TtyId[]) {
      delete activeVpnBridges[id];
      vpnLocationIds[id] = null;
    }
    physicalLocationId = saveState.physicalLocationId;
    globeSelectedCityId = null;
    unbootedSelectedCityId = null;
    activeTty = 1;

    for (const id of TTY_IDS) {
      ttyLogs[id] = [];
      ttyScrollBottomOffsets[id] = 0;
    }

    bootState = 'unbooted';
    setDisplayedBalancesImmediate(0, 0);
    renderTtyHeader();
    renderLogLines(true);
    renderBootOverlayState();
    renderLocationActionBar();
    requestGlobeWake?.();

    saveStatusMessage = '롤플레잉 세이브가 초기화되었습니다. (API 설정 유지)';
    renderModalOnly();
  });

  document.getElementById('toggle-scanline-btn')?.addEventListener('click', () => {
    config.crtScanlines = !config.crtScanlines;
    saveConfig(config);
    renderModalOnly();
  });

  document.getElementById('modal-pwa-install-btn')?.addEventListener('click', () => {
    triggerPwaInstall();
  });

  document.getElementById('close-pwa-guide-btn')?.addEventListener('click', () => {
    showPwaGuideInModal = false;
    renderModalOnly();
  });
}

document.getElementById('open-config-btn')?.addEventListener('click', () => {
  isConfigOpen = !isConfigOpen;
  renderModalOnly();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isConfigOpen) {
    isConfigOpen = false;
    renderModalOnly();
  }
});

renderModalOnly();
renderLocationActionBar();

// ==========================================
// Wireframe Globe Renderer (±60° Vertical Tilt, Auto-Rotation OFF)
// ==========================================
const globeCanvas = document.getElementById('globe-canvas') as HTMLCanvasElement | null;
const globeContainer = document.getElementById('globe-container');
const globeCoordsEl = document.getElementById('globe-coords');
const zoomAxisEl = document.getElementById('zoom-axis');
const zoomTrackEl = document.getElementById('zoom-track');
const zoomThumbEl = document.getElementById('zoom-thumb');
const zoomReadoutEl = document.getElementById('zoom-readout');

if (globeCanvas && globeContainer) {
  const gCtx = globeCanvas.getContext('2d');

  const MAX_LAT_TILT = 60 * DEG2RAD;
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const PRE_BOOT_TILT = 30 * DEG2RAD;
  const initialCity = getCityById(getActiveWorkspaceLocationId());
  let rotLon = -initialCity.lon * DEG2RAD;
  let rotLat = PRE_BOOT_TILT;
  let targetLon = rotLon;
  let targetLat = rotLat;

  let activePointerId: number | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartLon = rotLon;
  let dragStartLat = rotLat;
  let wasDragged = false;

  // Multi-touch pinch-to-zoom tracking
  const activeTouches = new Map<number, { x: number; y: number }>();
  let initialPinchDist: number | null = null;
  let initialPinchZoom = zoomLevel;

  let projectedCities: { city: CityNode; x: number; y: number; z: number }[] = [];

  // Precompute 3D unit-sphere coordinates once at startup to eliminate ~15,000 trig calls per frame
  interface SphereVertex {
    vx: number;
    vy: number;
    vz: number;
    lonDeg: number;
  }

  const toSphereVertex = (latDeg: number, lonDeg: number): SphereVertex => {
    const lat = latDeg * DEG2RAD;
    const lon = lonDeg * DEG2RAD;
    const cosLat = Math.cos(lat);
    return {
      vx: cosLat * Math.sin(lon),
      vy: Math.sin(lat),
      vz: cosLat * Math.cos(lon),
      lonDeg,
    };
  };

  const precomputedBorders: SphereVertex[][] = WORLD_BORDERS.map((poly) =>
    poly.map((pt) => toSphereVertex(pt[0], pt[1]))
  );

  const precomputedCoastlines: SphereVertex[][] = WORLD_COASTLINES.map((poly) =>
    poly.map((pt) => toSphereVertex(pt[0], pt[1]))
  );

  const precomputedParallels: { isEquator: boolean; pts: SphereVertex[] }[] = [];
  for (let lat = -75; lat <= 75; lat += 15) {
    const pts: SphereVertex[] = [];
    for (let lon = -180; lon <= 180; lon += 6) {
      pts.push(toSphereVertex(lat, lon));
    }
    precomputedParallels.push({ isEquator: lat === 0, pts });
  }

  const precomputedMeridians: SphereVertex[][] = [];
  for (let lon = -180; lon < 180; lon += 15) {
    const pts: SphereVertex[] = [];
    for (let lat = -75; lat <= 75; lat += 5) {
      pts.push(toSphereVertex(lat, lon));
    }
    precomputedMeridians.push(pts);
  }

  const precomputedCities: { city: CityNode; v: SphereVertex }[] = CITIES.map((city) => ({
    city,
    v: toSphereVertex(city.lat, city.lon),
  }));

  let isGlobeLoopRunning = false;
  let cachedCssWidth = 0;
  let cachedCssHeight = 0;
  let lastZoomTopText = '';
  let lastZoomReadoutText = '';
  let lastCoordLabelText = '';

  const wakeGlobeLoop = () => {
    if (!isGlobeLoopRunning && document.visibilityState !== 'hidden') {
      isGlobeLoopRunning = true;
      requestAnimationFrame(renderGlobe);
    }
  };

  requestGlobeWake = wakeGlobeLoop;

  focusCityOnGlobe = (city: CityNode) => {
    const desiredLon = -city.lon * DEG2RAD;
    targetLon = normalizeAngleDiff(desiredLon, rotLon);
    targetLat = clamp(city.lat * DEG2RAD, -MAX_LAT_TILT, MAX_LAT_TILT);
    wakeGlobeLoop();
  };

  getCurrentGlobeCameraCity = () => {
    const lat = rotLat * RAD2DEG;
    let lon = (-rotLon * RAD2DEG) % 360;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    return {
      id: '__cam__',
      name: 'CAM',
      lat,
      lon,
      vpnXmrCost: 0,
    };
  };

  const updateZoomUI = () => {
    if (!zoomThumbEl || !zoomReadoutEl) return;
    const ratio = (zoomLevel - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
    const topPct = `${((1 - clamp(ratio, 0, 1)) * 100).toFixed(1)}%`;
    const readout = `${zoomLevel.toFixed(1)}x`;
    if (topPct !== lastZoomTopText) {
      lastZoomTopText = topPct;
      zoomThumbEl.style.top = topPct;
    }
    if (readout !== lastZoomReadoutText) {
      lastZoomReadoutText = readout;
      zoomReadoutEl.textContent = readout;
    }
  };

  const resizeGlobe = () => {
    const rect = globeContainer.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    cachedCssWidth = rect.width;
    cachedCssHeight = rect.height;
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (globeCanvas.width !== targetW || globeCanvas.height !== targetH) {
      globeCanvas.width = targetW;
      globeCanvas.height = targetH;
    }
    if (gCtx) {
      gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    wakeGlobeLoop();
  };

  requestGlobeResize = resizeGlobe;
  resizeGlobe();
  window.addEventListener('resize', resizeGlobe);
  window.addEventListener('pageshow', () => {
    updateViewportGeometry();
    resizeGlobe();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateViewportGeometry();
      resizeGlobe();
    }
  });

  const globeTileEl = document.getElementById('globe-tile');
  let lastTouchpadPanTime = 0;

  const handleGlobeWheel = (e: WheelEvent) => {
    e.preventDefault();
    const targetEl = e.target as HTMLElement | null;
    const isOverZoomAxis = Boolean(targetEl && targetEl.closest('#zoom-axis'));

    const factor = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? 300 : 1;
    const rawDeltaX = e.deltaX * factor;
    const rawDeltaY = e.deltaY * factor;

    // 1. Two-touch vertical scroll (trackpad up/down or mouse wheel) = ZOOM IN / ZOOM OUT
    if (Math.abs(rawDeltaY) > 0 || e.ctrlKey || isOverZoomAxis) {
      const zoomMultiplier = e.ctrlKey ? 0.011 : 0.0025;
      const zoomDelta = -rawDeltaY * zoomMultiplier;
      targetZoom = clamp(targetZoom + zoomDelta, MIN_ZOOM, MAX_ZOOM);
    }

    // 2. Two-touch horizontal scroll (trackpad swipe left/right) = ROTATE HORIZONTALLY (Longitude)
    const isLockedByTransit = getActiveTransitForCurrentTty() !== null;
    if (Math.abs(rawDeltaX) > 0 && !isLockedByTransit) {
      lastTouchpadPanTime = performance.now();
      const sensitivity = 0.0046 / Math.sqrt(zoomLevel);
      targetLon += rawDeltaX * sensitivity;
    }

    wakeGlobeLoop();
  };

  // Safari macOS/iOS native trackpad pinch GestureEvent support
  let safariGestureStartZoom = zoomLevel;
  const gestureTarget = globeTileEl || globeContainer;
  gestureTarget.addEventListener(
    'gesturestart' as keyof HTMLElementEventMap,
    ((e: Event) => {
      e.preventDefault();
      safariGestureStartZoom = targetZoom;
    }) as EventListener,
    { passive: false }
  );
  gestureTarget.addEventListener(
    'gesturechange' as keyof HTMLElementEventMap,
    ((e: Event) => {
      e.preventDefault();
      const scale = (e as unknown as { scale?: number }).scale;
      if (typeof scale === 'number' && scale > 0) {
        targetZoom = clamp(safariGestureStartZoom * scale, MIN_ZOOM, MAX_ZOOM);
        wakeGlobeLoop();
      }
    }) as EventListener,
    { passive: false }
  );

  if (globeTileEl) {
    globeTileEl.addEventListener('wheel', handleGlobeWheel, { passive: false });
  } else {
    globeContainer.addEventListener('wheel', handleGlobeWheel, { passive: false });
  }

  if (zoomAxisEl && zoomTrackEl) {
    let zoomPointerId: number | null = null;

    const setZoomFromClientY = (clientY: number) => {
      const rect = zoomTrackEl.getBoundingClientRect();
      if (rect.height <= 0) return;
      const relY = clamp((clientY - rect.top) / rect.height, 0, 1);
      targetZoom = MIN_ZOOM + (1 - relY) * (MAX_ZOOM - MIN_ZOOM);
      wakeGlobeLoop();
    };

    zoomAxisEl.addEventListener('pointerdown', (e: PointerEvent) => {
      e.stopPropagation();
      zoomPointerId = e.pointerId;
      zoomAxisEl.setPointerCapture(e.pointerId);
      setZoomFromClientY(e.clientY);
    });

    zoomAxisEl.addEventListener('pointermove', (e: PointerEvent) => {
      if (zoomPointerId !== e.pointerId) return;
      e.stopPropagation();
      setZoomFromClientY(e.clientY);
    });

    const endZoomDrag = (e: PointerEvent) => {
      if (zoomPointerId !== e.pointerId) return;
      e.stopPropagation();
      if (zoomAxisEl.hasPointerCapture(e.pointerId)) {
        zoomAxisEl.releasePointerCapture(e.pointerId);
      }
      zoomPointerId = null;
    };

    zoomAxisEl.addEventListener('pointerup', endZoomDrag);
    zoomAxisEl.addEventListener('pointercancel', endZoomDrag);
  }

  globeContainer.addEventListener('pointerdown', (e: PointerEvent) => {
    const targetEl = e.target as HTMLElement;
    if (targetEl.closest('#location-action-bar') || targetEl.closest('#zoom-axis')) {
      return;
    }

    activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activeTouches.size === 2) {
      const pts = Array.from(activeTouches.values());
      initialPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      initialPinchZoom = targetZoom;
      wasDragged = true;
      wakeGlobeLoop();
      return;
    }

    activePointerId = e.pointerId;
    globeContainer.setPointerCapture(e.pointerId);
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartLon = targetLon;
    dragStartLat = targetLat;
    wasDragged = false;
    wakeGlobeLoop();
  });

  globeContainer.addEventListener('pointermove', (e: PointerEvent) => {
    if (activeTouches.has(e.pointerId)) {
      activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activeTouches.size >= 2 && initialPinchDist && initialPinchDist > 10) {
      const pts = Array.from(activeTouches.values());
      const curDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const scale = curDist / initialPinchDist;
      targetZoom = clamp(initialPinchZoom * scale, MIN_ZOOM, MAX_ZOOM);
      wasDragged = true;
      wakeGlobeLoop();
      return;
    }

    if (activePointerId !== e.pointerId) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (Math.hypot(dx, dy) > 5) {
      wasDragged = true;
    }

    const isLockedByTransit = getActiveTransitForCurrentTty() !== null;
    if (wasDragged && !isLockedByTransit) {
      const sensitivity = 0.0055 / Math.sqrt(zoomLevel);
      targetLon = dragStartLon + dx * sensitivity;
      targetLat = clamp(dragStartLat + dy * sensitivity, -MAX_LAT_TILT, MAX_LAT_TILT);
      wakeGlobeLoop();
    }
  });

  const endPointerDrag = (e: PointerEvent) => {
    activeTouches.delete(e.pointerId);
    if (activeTouches.size === 0) {
      initialPinchDist = null;
      activePointerId = null;
    }
    if (globeContainer.hasPointerCapture(e.pointerId)) {
      globeContainer.releasePointerCapture(e.pointerId);
    }

    if (activePointerId === e.pointerId) {
      activePointerId = null;
    }

    const targetEl = e.target as HTMLElement | null;
    if (targetEl && (targetEl.closest('#location-action-bar') || targetEl.closest('#zoom-axis'))) {
      wakeGlobeLoop();
      return;
    }

    const isLockedByTransit = getActiveTransitForCurrentTty() !== null;
    if (!wasDragged && !isLockedByTransit) {
      const rect = globeContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let hitCity: CityNode | null = null;
      let minDist = 18;
      for (const item of projectedCities) {
        if (item.z > 0.05) {
          const d = Math.hypot(clickX - item.x, clickY - item.y);
          if (d < minDist) {
            minDist = d;
            hitCity = item.city;
          }
        }
      }

      if (bootState === 'unbooted') {
        if (hitCity) {
          e.preventDefault();
          unbootedSelectedCityId = hitCity.id;
          if (focusCityOnGlobe) {
            focusCityOnGlobe(hitCity);
          }
        } else {
          unbootedSelectedCityId = null;
        }
      } else {
        if (hitCity) {
          e.preventDefault();
          globeSelectedCityId = hitCity.id;
          if (focusCityOnGlobe) {
            focusCityOnGlobe(hitCity);
          }
          renderLocationActionBar();
        } else {
          globeSelectedCityId = null;
          renderLocationActionBar();
        }
      }
    }
    wakeGlobeLoop();
  };

  globeContainer.addEventListener('pointerup', endPointerDrag);
  globeContainer.addEventListener('pointercancel', endPointerDrag);

  function updateCoordLabel() {
    if (!globeCoordsEl) return;
    const degLat = rotLat * RAD2DEG;
    let degLon = (-rotLon * RAD2DEG) % 360;
    if (degLon > 180) degLon -= 360;
    if (degLon < -180) degLon += 360;

    const latSign = degLat >= 0 ? '+' : '';
    const lonSign = degLon >= 0 ? '+' : '';
    const text = `LAT ${latSign}${degLat.toFixed(1)}° · LON ${lonSign}${degLon.toFixed(1)}°`;
    if (text !== lastCoordLabelText) {
      lastCoordLabelText = text;
      globeCoordsEl.textContent = text;
    }
  }

  function projectLatLon(latDeg: number, lonDeg: number, radius: number, cx: number, cy: number) {
    const lat = latDeg * DEG2RAD;
    const lon = lonDeg * DEG2RAD + rotLon;

    const x0 = Math.cos(lat) * Math.sin(lon);
    const y0 = Math.sin(lat);
    const z0 = Math.cos(lat) * Math.cos(lon);

    const cosP = Math.cos(rotLat);
    const sinP = Math.sin(rotLat);
    const y1 = y0 * cosP - z0 * sinP;
    const z1 = y0 * sinP + z0 * cosP;

    return {
      x: cx + x0 * radius,
      y: cy - y1 * radius,
      z: z1,
    };
  }

  function interpolateGreatCircle(a: CityNode, b: CityNode, t: number): { lat: number; lon: number } {
    const lat1 = a.lat * DEG2RAD;
    const lon1 = a.lon * DEG2RAD;
    const lat2 = b.lat * DEG2RAD;
    const lon2 = b.lon * DEG2RAD;

    const x1 = Math.cos(lat1) * Math.cos(lon1);
    const y1 = Math.cos(lat1) * Math.sin(lon1);
    const z1 = Math.sin(lat1);

    const x2 = Math.cos(lat2) * Math.cos(lon2);
    const y2 = Math.cos(lat2) * Math.sin(lon2);
    const z2 = Math.sin(lat2);

    const dot = clamp(x1 * x2 + y1 * y2 + z1 * z2, -1, 1);
    const omega = Math.acos(dot);

    if (omega < 0.0001) {
      return { lat: a.lat, lon: a.lon };
    }

    const sinOmega = Math.sin(omega);
    const w1 = Math.sin((1 - t) * omega) / sinOmega;
    const w2 = Math.sin(t * omega) / sinOmega;

    const x = w1 * x1 + w2 * x2;
    const y = w1 * y1 + w2 * y2;
    const z = w1 * z1 + w2 * z2;

    const lat = Math.atan2(z, Math.hypot(x, y)) * RAD2DEG;
    const lon = Math.atan2(y, x) * RAD2DEG;
    return { lat, lon };
  }

  function getLivePhysicalOriginCity(): CityNode {
    if (activeFlight) {
      const pos = interpolateGreatCircle(
        activeFlight.fromCity,
        activeFlight.toCity,
        activeFlight.progress
      );
      return {
        id: physicalLocationId,
        name: 'LOC',
        lat: pos.lat,
        lon: pos.lon,
        vpnXmrCost: 0,
      };
    }
    return getCityById(physicalLocationId);
  }

  function renderGlobe(now: number) {
    if (!gCtx || !globeCanvas || document.visibilityState === 'hidden') {
      isGlobeLoopRunning = false;
      return;
    }

    if (cachedCssWidth <= 0 || cachedCssHeight <= 0) {
      const rect = globeContainer!.getBoundingClientRect();
      cachedCssWidth = rect.width;
      cachedCssHeight = rect.height;
    }
    const w = cachedCssWidth;
    const h = cachedCssHeight;
    if (w <= 0 || h <= 0) {
      isGlobeLoopRunning = false;
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);
    if (globeCanvas.width !== targetW || globeCanvas.height !== targetH) {
      globeCanvas.width = targetW;
      globeCanvas.height = targetH;
    }
    gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gCtx.clearRect(0, 0, w, h);

    const isTouchpadInteracting = now - lastTouchpadPanTime < 160;
    const isUserDirectInteracting =
      activePointerId !== null || activeTouches.size > 0 || isTouchpadInteracting;

    // Physical Flight Progress (TTY 1 and any VPN-unused session following TTY 1)
    const activeFollowsFlight =
      activeTty === 1 || (!isWorkspaceUsingVpn(activeTty) && !activeVpnBridges[activeTty]);

    if (activeFlight) {
      const elapsed = Math.max(0, now - activeFlight.startTime);
      const t = clamp(elapsed / activeFlight.durationMs, 0, 1);
      activeFlight.progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      if (activeFollowsFlight) {
        const planePos = interpolateGreatCircle(
          activeFlight.fromCity,
          activeFlight.toCity,
          activeFlight.progress
        );
        targetLon = normalizeAngleDiff(-planePos.lon * DEG2RAD, rotLon);
        targetLat = clamp(planePos.lat * DEG2RAD, -MAX_LAT_TILT, MAX_LAT_TILT);
      }

      if (t >= 1) {
        const arrivedCity = activeFlight.toCity;
        physicalLocationId = arrivedCity.id;
        // Preserve all existing VPNs even when flying through or arriving at a VPN target city
        if (activeTty === 1 || !isWorkspaceUsingVpn(activeTty)) {
          globeSelectedCityId = null;
        }
        activeFlight = null;
        renderLocationActionBar();
        if (bootState === 'booted') {
          syncAndPersistSaveState();
        }
      }
    }

    const livePhysicalOrigin = getLivePhysicalOriginCity();

    // VPN Bridge / Ping Progress (TTY 2..5)
    let hasActiveVpnBridge = false;
    for (const ttyId of [2, 3, 4, 5] as TtyId[]) {
      const vpnTransit = activeVpnBridges[ttyId];
      if (!vpnTransit) continue;
      hasActiveVpnBridge = true;

      vpnTransit.fromCity = livePhysicalOrigin;

      const prevProgress = vpnTransit.progress;
      const elapsed = Math.max(0, now - vpnTransit.startTime);
      const t = clamp(elapsed / vpnTransit.durationMs, 0, 1);
      vpnTransit.progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      if (activeTty === ttyId) {
        const camPos = interpolateGreatCircle(
          vpnTransit.camStartCity,
          vpnTransit.toCity,
          vpnTransit.progress
        );
        targetLon = normalizeAngleDiff(-camPos.lon * DEG2RAD, rotLon);
        targetLat = clamp(camPos.lat * DEG2RAD, -MAX_LAT_TILT, MAX_LAT_TILT);

        if (
          vpnTransit.toCity.id !== physicalLocationId &&
          prevProgress < 0.55 &&
          vpnTransit.progress >= 0.55
        ) {
          const statusEl = document.getElementById('vpn-transit-status-label');
          if (statusEl) statusEl.textContent = 'Bridging';
        }
      }

      if (t >= 1) {
        const connectedCity = vpnTransit.toCity;
        // Keep VPN active even if planted at the current physical location
        vpnLocationIds[ttyId] = connectedCity.id;
        if (activeTty === ttyId) {
          globeSelectedCityId = null;
        }
        delete activeVpnBridges[ttyId];
        if (activeTty === ttyId) {
          renderLocationActionBar();
        }
        if (bootState === 'booted') {
          syncAndPersistSaveState();
        }
      }
    }

    const dLon = targetLon - rotLon;
    const dLat = targetLat - rotLat;
    const dZoom = targetZoom - zoomLevel;
    const isSettling =
      Math.abs(dLon) > 0.00015 || Math.abs(dLat) > 0.00015 || Math.abs(dZoom) > 0.0004;

    if (isUserDirectInteracting) {
      rotLon = targetLon;
      rotLat = clamp(targetLat, -MAX_LAT_TILT, MAX_LAT_TILT);
      zoomLevel = targetZoom;
    } else if (isSettling) {
      rotLon += dLon * 0.35;
      rotLat = clamp(rotLat + dLat * 0.35, -MAX_LAT_TILT, MAX_LAT_TILT);
      zoomLevel += dZoom * 0.35;
    } else {
      rotLon = targetLon;
      rotLat = clamp(targetLat, -MAX_LAT_TILT, MAX_LAT_TILT);
      zoomLevel = targetZoom;
    }

    updateZoomUI();
    updateCoordLabel();

    const cx = w / 2;
    const cy = h / 2;
    const heightBoost = clamp((h - 180) / 220, 0, 1);
    const baseRadiusFactor = 0.42 + heightBoost * 0.05;
    const baseRadius = Math.min(h * baseRadiusFactor, w * 0.47);
    const radius = baseRadius * zoomLevel;

    // Compute frame rotation trig ONCE per frame
    const cLon = Math.cos(rotLon);
    const sLon = Math.sin(rotLon);
    const cLat = Math.cos(rotLat);
    const sLat = Math.sin(rotLat);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.36)';
    gCtx.lineWidth = 1.1;
    gCtx.beginPath();
    gCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    gCtx.stroke();

    // 1 & 2. Batched Graticule Grid (Parallels + Meridians in 3 depth buckets instead of 1,380 draw calls)
    const gridEdge = new Path2D();
    const gridCenter = new Path2D();
    const equatorPath = new Path2D();

    for (const parallel of precomputedParallels) {
      const pts = parallel.pts;
      const isEq = parallel.isEquator;
      const v0 = pts[0];
      let z0 = v0.vz * cLon - v0.vx * sLon;
      let prevX = cx + (v0.vx * cLon + v0.vz * sLon) * radius;
      let prevY = cy - (v0.vy * cLat - z0 * sLat) * radius;
      let prevZ = v0.vy * sLat + z0 * cLat;

      for (let i = 1; i < pts.length; i++) {
        const v = pts[i];
        z0 = v.vz * cLon - v.vx * sLon;
        const curX = cx + (v.vx * cLon + v.vz * sLon) * radius;
        const curY = cy - (v.vy * cLat - z0 * sLat) * radius;
        const curZ = v.vy * sLat + z0 * cLat;

        const avgZ = (prevZ + curZ) * 0.5;
        if (avgZ > 0) {
          if (isEq) {
            equatorPath.moveTo(prevX, prevY);
            equatorPath.lineTo(curX, curY);
          } else if (avgZ > 0.4) {
            gridCenter.moveTo(prevX, prevY);
            gridCenter.lineTo(curX, curY);
          } else {
            gridEdge.moveTo(prevX, prevY);
            gridEdge.lineTo(curX, curY);
          }
        }
        prevX = curX;
        prevY = curY;
        prevZ = curZ;
      }
    }

    for (const pts of precomputedMeridians) {
      const v0 = pts[0];
      let z0 = v0.vz * cLon - v0.vx * sLon;
      let prevX = cx + (v0.vx * cLon + v0.vz * sLon) * radius;
      let prevY = cy - (v0.vy * cLat - z0 * sLat) * radius;
      let prevZ = v0.vy * sLat + z0 * cLat;

      for (let i = 1; i < pts.length; i++) {
        const v = pts[i];
        z0 = v.vz * cLon - v.vx * sLon;
        const curX = cx + (v.vx * cLon + v.vz * sLon) * radius;
        const curY = cy - (v.vy * cLat - z0 * sLat) * radius;
        const curZ = v.vy * sLat + z0 * cLat;

        const avgZ = (prevZ + curZ) * 0.5;
        if (avgZ > 0.4) {
          gridCenter.moveTo(prevX, prevY);
          gridCenter.lineTo(curX, curY);
        } else if (avgZ > 0) {
          gridEdge.moveTo(prevX, prevY);
          gridEdge.lineTo(curX, curY);
        }
        prevX = curX;
        prevY = curY;
        prevZ = curZ;
      }
    }

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    gCtx.lineWidth = 0.7;
    gCtx.stroke(gridEdge);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    gCtx.lineWidth = 0.7;
    gCtx.stroke(gridCenter);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
    gCtx.lineWidth = 1.0;
    gCtx.stroke(equatorPath);

    // 3A. Natural Earth Inland Country Borders (Front hemisphere only)
    const borderFrontNear = new Path2D();
    const borderFrontEdge = new Path2D();
    for (const poly of precomputedBorders) {
      const v0 = poly[0];
      let z0 = v0.vz * cLon - v0.vx * sLon;
      let prevX = cx + (v0.vx * cLon + v0.vz * sLon) * radius;
      let prevY = cy - (v0.vy * cLat - z0 * sLat) * radius;
      let prevZ = v0.vy * sLat + z0 * cLat;
      let prevLon = v0.lonDeg;

      for (let i = 1; i < poly.length; i++) {
        const v = poly[i];
        z0 = v.vz * cLon - v.vx * sLon;
        const curX = cx + (v.vx * cLon + v.vz * sLon) * radius;
        const curY = cy - (v.vy * cLat - z0 * sLat) * radius;
        const curZ = v.vy * sLat + z0 * cLat;

        if (Math.abs(v.lonDeg - prevLon) < 90 && (prevZ >= 0 || curZ >= 0)) {
          const avgZ = (prevZ + curZ) * 0.5;
          if (avgZ > 0.35) {
            borderFrontNear.moveTo(prevX, prevY);
            borderFrontNear.lineTo(curX, curY);
          } else if (avgZ > 0.02) {
            borderFrontEdge.moveTo(prevX, prevY);
            borderFrontEdge.lineTo(curX, curY);
          }
        }
        prevX = curX;
        prevY = curY;
        prevZ = curZ;
        prevLon = v.lonDeg;
      }
    }
    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
    gCtx.lineWidth = 0.6;
    gCtx.stroke(borderFrontEdge);
    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
    gCtx.lineWidth = 0.7;
    gCtx.stroke(borderFrontNear);

    // 3B. Natural Earth 50m Coastlines (Front hemisphere only)
    const coastHorizon = new Path2D();
    const coastMid = new Path2D();
    const coastCenter = new Path2D();

    for (const poly of precomputedCoastlines) {
      const v0 = poly[0];
      let z0 = v0.vz * cLon - v0.vx * sLon;
      let prevX = cx + (v0.vx * cLon + v0.vz * sLon) * radius;
      let prevY = cy - (v0.vy * cLat - z0 * sLat) * radius;
      let prevZ = v0.vy * sLat + z0 * cLat;
      let prevLon = v0.lonDeg;

      for (let i = 1; i < poly.length; i++) {
        const v = poly[i];
        z0 = v.vz * cLon - v.vx * sLon;
        const curX = cx + (v.vx * cLon + v.vz * sLon) * radius;
        const curY = cy - (v.vy * cLat - z0 * sLat) * radius;
        const curZ = v.vy * sLat + z0 * cLat;

        if (Math.abs(v.lonDeg - prevLon) < 90 && (prevZ >= 0 || curZ >= 0)) {
          const avgZ = (prevZ + curZ) * 0.5;
          if (avgZ > 0.55) {
            coastCenter.moveTo(prevX, prevY);
            coastCenter.lineTo(curX, curY);
          } else if (avgZ > 0.2) {
            coastMid.moveTo(prevX, prevY);
            coastMid.lineTo(curX, curY);
          } else if (avgZ > 0) {
            coastHorizon.moveTo(prevX, prevY);
            coastHorizon.lineTo(curX, curY);
          }
        }
        prevX = curX;
        prevY = curY;
        prevZ = curZ;
        prevLon = v.lonDeg;
      }
    }

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    gCtx.lineWidth = 0.85;
    gCtx.stroke(coastHorizon);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    gCtx.lineWidth = 1.05;
    gCtx.stroke(coastMid);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.68)';
    gCtx.lineWidth = 1.2;
    gCtx.stroke(coastCenter);

    // 4A. Physical Flight Trajectory (White on TTY 1 / LOC-following session, Gray on VPN-active sessions)
    if (activeFlight) {
      const isPrimaryFlightView = activeFollowsFlight;
      const steps = 32;
      for (let s = 0; s < steps; s++) {
        const t1 = s / steps;
        const t2 = (s + 1) / steps;
        const pos1 = interpolateGreatCircle(activeFlight.fromCity, activeFlight.toCity, t1);
        const pos2 = interpolateGreatCircle(activeFlight.fromCity, activeFlight.toCity, t2);

        const alt1 = 1 + Math.sin(t1 * Math.PI) * 0.05;
        const alt2 = 1 + Math.sin(t2 * Math.PI) * 0.05;

        const p1 = projectLatLon(pos1.lat, pos1.lon, radius * alt1, cx, cy);
        const p2 = projectLatLon(pos2.lat, pos2.lon, radius * alt2, cx, cy);

        if (p1.z > -0.05 && p2.z > -0.05) {
          const isTraversed = t2 <= activeFlight.progress;
          gCtx.beginPath();
          gCtx.moveTo(p1.x, p1.y);
          gCtx.lineTo(p2.x, p2.y);
          if (isPrimaryFlightView) {
            gCtx.strokeStyle = isTraversed
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.35)';
            gCtx.lineWidth = isTraversed ? 1.5 : 1.0;
          } else {
            gCtx.strokeStyle = isTraversed
              ? 'rgba(165, 165, 165, 0.48)'
              : 'rgba(140, 140, 140, 0.22)';
            gCtx.lineWidth = isTraversed ? 1.1 : 0.8;
          }
          if (!isTraversed) gCtx.setLineDash([3, 3]);
          gCtx.stroke();
          gCtx.setLineDash([]);
        }
      }

      const curPos = interpolateGreatCircle(
        activeFlight.fromCity,
        activeFlight.toCity,
        activeFlight.progress
      );
      const curAlt = 1 + Math.sin(activeFlight.progress * Math.PI) * 0.05;
      const planePt = projectLatLon(curPos.lat, curPos.lon, radius * curAlt, cx, cy);
      if (planePt.z > 0) {
        gCtx.fillStyle = isPrimaryFlightView ? '#ffffff' : 'rgba(185, 185, 185, 0.75)';
        gCtx.beginPath();
        gCtx.arc(planePt.x, planePt.y, isPrimaryFlightView ? 3.2 : 2.5, 0, Math.PI * 2);
        gCtx.fill();
      }
    }

    // 4B. VPN Connection Lines for TTY 2..5 (All visible across sessions; gray for other TTYs, white for current TTY)
    const drawVpnLineForTty = (ttyId: TtyId, isFocusedTty: boolean) => {
      const vpnTransit = activeVpnBridges[ttyId];
      if (vpnTransit) {
        const steps = 32;
        for (let s = 0; s < steps; s++) {
          const t1 = s / steps;
          const t2 = (s + 1) / steps;
          const pos1 = interpolateGreatCircle(livePhysicalOrigin, vpnTransit.toCity, t1);
          const pos2 = interpolateGreatCircle(livePhysicalOrigin, vpnTransit.toCity, t2);

          const p1 = projectLatLon(pos1.lat, pos1.lon, radius, cx, cy);
          const p2 = projectLatLon(pos2.lat, pos2.lon, radius, cx, cy);

          if (p1.z > -0.05 && p2.z > -0.05) {
            const isLocked = t2 <= vpnTransit.progress;
            gCtx.beginPath();
            gCtx.moveTo(p1.x, p1.y);
            gCtx.lineTo(p2.x, p2.y);
            if (isFocusedTty) {
              gCtx.strokeStyle = isLocked
                ? 'rgba(255, 255, 255, 0.92)'
                : 'rgba(255, 255, 255, 0.30)';
              gCtx.lineWidth = isLocked ? 1.4 : 0.9;
            } else {
              gCtx.strokeStyle = isLocked
                ? 'rgba(165, 165, 165, 0.45)'
                : 'rgba(140, 140, 140, 0.22)';
              gCtx.lineWidth = isLocked ? 1.05 : 0.8;
            }
            if (!isLocked) gCtx.setLineDash([2, 3]);
            gCtx.stroke();
            gCtx.setLineDash([]);
          }
        }

        const packetPos = interpolateGreatCircle(
          livePhysicalOrigin,
          vpnTransit.toCity,
          vpnTransit.progress
        );
        const packetPt = projectLatLon(packetPos.lat, packetPos.lon, radius, cx, cy);
        if (packetPt.z > 0) {
          const packetColor = isFocusedTty ? '#ffffff' : 'rgba(180, 180, 180, 0.65)';
          gCtx.strokeStyle = packetColor;
          gCtx.lineWidth = isFocusedTty ? 1.2 : 1.0;
          gCtx.strokeRect(packetPt.x - 4, packetPt.y - 4, 8, 8);
          gCtx.fillStyle = packetColor;
          gCtx.fillRect(packetPt.x - 1.5, packetPt.y - 1.5, 3, 3);
        }
        return;
      }

      if (isWorkspaceUsingVpn(ttyId)) {
        const vpnTargetCity = getCityById(vpnLocationIds[ttyId]);
        const steps = 32;
        for (let s = 0; s < steps; s++) {
          const t1 = s / steps;
          const t2 = (s + 1) / steps;
          const pos1 = interpolateGreatCircle(livePhysicalOrigin, vpnTargetCity, t1);
          const pos2 = interpolateGreatCircle(livePhysicalOrigin, vpnTargetCity, t2);

          const p1 = projectLatLon(pos1.lat, pos1.lon, radius, cx, cy);
          const p2 = projectLatLon(pos2.lat, pos2.lon, radius, cx, cy);

          if (p1.z > -0.05 && p2.z > -0.05) {
            gCtx.beginPath();
            gCtx.moveTo(p1.x, p1.y);
            gCtx.lineTo(p2.x, p2.y);
            gCtx.strokeStyle = isFocusedTty
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(165, 165, 165, 0.42)';
            gCtx.lineWidth = isFocusedTty ? 1.3 : 1.05;
            gCtx.stroke();
          }
        }
      }
    };

    // Pass 1: Draw other TTYs' VPN lines in subtle gray
    for (const ttyId of [2, 3, 4, 5] as TtyId[]) {
      if (ttyId !== activeTty) {
        drawVpnLineForTty(ttyId, false);
      }
    }
    // Pass 2: Draw active TTY's VPN line on top in bright white
    if (activeTty !== 1) {
      drawVpnLineForTty(activeTty, true);
    }

    // 5. Location Points
    const isBootedOrBooting = bootState !== 'unbooted';
    const activeWorkspaceCityId = getActiveWorkspaceLocationId();
    const otherVpnCityIds = new Set<string>();
    if (isBootedOrBooting) {
      for (const ttyId of [2, 3, 4, 5] as TtyId[]) {
        if (ttyId !== activeTty && vpnLocationIds[ttyId]) {
          otherVpnCityIds.add(vpnLocationIds[ttyId]!);
        }
      }
    }
    projectedCities = [];
    const isLargeGlobe = h >= 260 && w >= 540;
    gCtx.font = isLargeGlobe
      ? '11.5px "JetBrains Mono", monospace'
      : '10px "JetBrains Mono", monospace';

    for (const item of precomputedCities) {
      const { city, v } = item;
      const z0 = v.vz * cLon - v.vx * sLon;
      const px = cx + (v.vx * cLon + v.vz * sLon) * radius;
      const py = cy - (v.vy * cLat - z0 * sLat) * radius;
      const pz = v.vy * sLat + z0 * cLat;

      projectedCities.push({ city, x: px, y: py, z: pz });

      if (pz > 0.08) {
        const isCurrent = isBootedOrBooting && city.id === activeWorkspaceCityId;
        const isOtherVpnNode = !isCurrent && otherVpnCityIds.has(city.id);
        const isSelected = isBootedOrBooting
          ? city.id === globeSelectedCityId
          : city.id === unbootedSelectedCityId;
        const alpha = clamp(0.45 + pz * 0.55, 0.45, 1);

        gCtx.fillStyle = `rgba(255, 255, 255, ${isCurrent || isSelected ? '1.0' : alpha.toFixed(2)})`;
        gCtx.beginPath();
        gCtx.arc(
          px,
          py,
          isCurrent || isSelected ? (isLargeGlobe ? 3.3 : 2.8) : isLargeGlobe ? 2.3 : 2.0,
          0,
          Math.PI * 2
        );
        gCtx.fill();

        if (isCurrent) {
          gCtx.strokeStyle = '#ffffff';
          gCtx.lineWidth = 1.2;
          gCtx.strokeRect(px - 6, py - 6, 12, 12);
          if (activeTty !== 1 && isWorkspaceUsingVpn(activeTty)) {
            gCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
            gCtx.lineWidth = 0.9;
            gCtx.strokeRect(px - 9, py - 9, 18, 18);
          }
        } else if (isOtherVpnNode) {
          gCtx.strokeStyle = 'rgba(165, 165, 165, 0.50)';
          gCtx.lineWidth = 1.0;
          gCtx.strokeRect(px - 5, py - 5, 10, 10);
        }
        if (isSelected && !isCurrent) {
          gCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          gCtx.lineWidth = 1;
          gCtx.beginPath();
          gCtx.arc(px, py, 6, 0, Math.PI * 2);
          gCtx.stroke();
        }

        gCtx.fillStyle =
          isCurrent || isSelected
            ? '#ffffff'
            : `rgba(255, 255, 255, ${(alpha * 0.78).toFixed(2)})`;
        gCtx.fillText(city.name.toUpperCase(), px + (isLargeGlobe ? 9 : 8), py + 3.5);
      }
    }

    const needsNextFrame =
      isSettling ||
      activeFlight !== null ||
      hasActiveVpnBridge ||
      activePointerId !== null ||
      activeTouches.size > 0 ||
      isTouchpadInteracting;

    if (needsNextFrame) {
      requestAnimationFrame(renderGlobe);
    } else {
      isGlobeLoopRunning = false;
    }
  }

  wakeGlobeLoop();
}
