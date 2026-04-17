/**
 * FlyAI 客户端 - 飞猪 MCP HTTP API 调用
 * 
 * 技术路径：
 * - FlyAI CLI 底层调用飞猪 MCP HTTP API (JSON-RPC over HTTPS)
 * - 端点: https://flyai.open.fliggy.com/mcp
 * - 工具名称: search_flight, search_domestic_train, search_hotels, search_poi
 * - 支持无 API Key 试调用 (使用内置默认 Key)
 * 
 * 优势：
 * - 纯 HTTP fetch，Vercel serverless 100% 兼容
 * - 0 本地依赖
 * - 可返回真实飞猪数据
 */

import crypto from 'crypto';

// MCP API 端点
const FLYAI_MCP_URL = process.env.FLYAI_MCP_URL || 'https://flyai.open.fliggy.com/mcp';

// 默认 API Key (FlyAI CLI 内置)
const DEFAULT_API_KEY = 'sk-faRn8Kp2QzXvLm9YtA4EjHcWbS7oUdG5iF3xNqV6rZ';
const FLYAI_API_KEY = process.env.FLYAI_API_KEY || DEFAULT_API_KEY;

// 签名密钥
const FLYAI_SIGN_SECRET = process.env.FLYAI_SIGN_SECRET;
const DEFAULT_SIGN_KEY = 'XSbdYnucPARDc9knhD8+X6hxdD1Nh6ZGI6Hadg25kBw=';

/**
 * 生成设备 ID
 */
function generateDeviceId(): string {
  return crypto.randomUUID();
}

/**
 * 生成请求签名
 */
function generateSignature(params: {
  method: string;
  pathname: string;
  timestampMs: string;
  nonce: string;
  body: string;
  authorization: string;
}): Record<string, string> {
  const secret = FLYAI_SIGN_SECRET || DEFAULT_SIGN_KEY;
  const signData = [
    params.method,
    params.pathname,
    params.timestampMs,
    params.nonce,
    params.body,
    params.authorization,
  ].join('\n');
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signData, 'utf8')
    .digest('base64url');
  
  return {
    'x-flyai-sign-ver': '7',
    'x-flyai-sign-alg': 'hmac-sha256',
    'x-flyai-ts': params.timestampMs,
    'x-flyai-nonce': params.nonce,
    'x-flyai-sign': signature,
  };
}

/**
 * 构建请求头
 */
function buildHeaders(body: string, pathname: string = '/'): Record<string, string> {
  const timestampMs = Date.now().toString();
  const nonce = crypto.randomBytes(8).toString('hex');
  const authorization = `Bearer ${FLYAI_API_KEY}`;
  const bodyHash = crypto.createHash('sha256').update(body, 'utf8').digest('hex');
  
  const signatureHeaders = generateSignature({
    method: 'POST',
    pathname,
    timestampMs,
    nonce,
    body: bodyHash,
    authorization,
  });
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
    'Authorization': authorization,
    'x-ff-ctx': buildFingerprint(),
    'x-ttid': 'ai2c(sk.clawhub)',
    'User-Agent': `flyai-cli/1.0.6 (Node.js ${process.version}; ${process.platform} ${process.arch})`,
    ...signatureHeaders,
  };
}

/**
 * 构建客户端指纹
 */
function buildFingerprint(): string {
  const lang = 'en';
  const platform = process.platform === 'darwin' ? 'Macintosh' : process.platform === 'win32' ? 'Windows' : 'Linux';
  const memoryTierGB = Math.min(8, Math.max(2, Math.floor(require('os').totalmem() / 1024 / 1024 / 1024 / 1024)));
  
  const data = {
    machine: {
      platform: process.platform,
      arch: process.env.ARM_ARCH_DETECTED || process.arch,
      cpus: require('os').cpus().length,
      memoryTierGB,
      osType: require('os').type(),
      nodeVersion: process.version,
      osReleaseMajor: require('os').release().split('.')[0],
    },
    fingerprint: {
      language: lang,
      platform,
      userAgent: `flyai-cli/1.0.6 (Node.js ${process.version}; ${platform})`,
      hardwareConcurrency: require('os').cpus().length,
      deviceMemory: memoryTierGB,
      clientSurface: 'cli',
      timezoneOffset: -new Date().getTimezoneOffset(),
      deviceId: generateDeviceId(),
    },
  };
  
  const jsonStr = JSON.stringify(data);
  const gzip = require('zlib').gzipSync(Buffer.from(jsonStr, 'utf-8'));
  return gzip.toString('base64');
}

/**
 * 调用 FlyAI MCP 工具
 */
async function callMCP(
  toolName: string,
  arguments_: Record<string, unknown>,
  options?: { limit?: number }
): Promise<unknown> {
  const mcpUrl = process.env.FLYAI_MCP_URL || FLYAI_MCP_URL;
  const url = new URL(mcpUrl.replace(/\/$/, ''));
  const pathname = url.pathname || '/';
  
  const requestBody = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: {
        ...arguments_,
        limit: options?.limit || 10,
      },
    },
  });
  
  const headers = buildHeaders(requestBody, pathname);
  
  const response = await fetch(mcpUrl, {
    method: 'POST',
    headers,
    body: requestBody,
    signal: AbortSignal.timeout(30000), // 30s 超时
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FlyAI MCP HTTP ${response.status}: ${errorText}`);
  }
  
  const contentType = response.headers.get('Content-Type') || '';
  
  // 处理 SSE 响应
  if (contentType.includes('text/event-stream')) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        // 解析 SSE 行
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.result) {
                result = JSON.stringify(parsed.result);
              }
            } catch {}
          }
        }
      }
    }
    
    return result ? JSON.parse(result) : null;
  }
  
  // 处理 JSON 响应
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    
    // 提取 result
    if (parsed.result !== undefined) {
      // 如果 result.content 是文本，尝试解析其中的 JSON
      if (parsed.result?.content) {
        const content = parsed.result.content;
        if (Array.isArray(content) && content[0]?.text) {
          try {
            return JSON.parse(content[0].text);
          } catch {
            return content[0].text;
          }
        }
        return parsed.result;
      }
      return parsed.result;
    }
    
    // 如果直接是数据
    if (parsed.data) return parsed.data;
    
    return parsed;
  } catch {
    return text;
  }
}

/**
 * 搜索机票
 */
export async function searchFlights(params: {
  origin: string;
  destination?: string;
  depDate?: string;
  depDateStart?: string;
  depDateEnd?: string;
  backDate?: string;
  journeyType?: 1 | 2;
  seatClassName?: string;
  maxPrice?: number;
  sortType?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}): Promise<unknown> {
  const args: Record<string, unknown> = { origin: params.origin };
  
  if (params.destination) args.destination = params.destination;
  if (params.depDate) args.depDate = params.depDate;
  if (params.depDateStart) args.depDateStart = params.depDateStart;
  if (params.depDateEnd) args.depDateEnd = params.depDateEnd;
  if (params.backDate) args.backDate = params.backDate;
  if (params.journeyType) args.journeyType = params.journeyType;
  if (params.seatClassName) args.seatClassName = params.seatClassName;
  if (params.maxPrice) args.maxPrice = params.maxPrice;
  if (params.sortType) args.sortType = params.sortType;
  
  return callMCP('search_flight', args);
}

/**
 * 搜索火车票
 */
export async function searchTrains(params: {
  origin: string;
  destination?: string;
  depDate?: string;
  depDateStart?: string;
  depDateEnd?: string;
  backDate?: string;
  journeyType?: 1 | 2;
  seatClassName?: string;
  maxPrice?: number;
  sortType?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}): Promise<unknown> {
  const args: Record<string, unknown> = { origin: params.origin };
  
  if (params.destination) args.destination = params.destination;
  if (params.depDate) args.depDate = params.depDate;
  if (params.depDateStart) args.depDateStart = params.depDateStart;
  if (params.depDateEnd) args.depDateEnd = params.depDateEnd;
  if (params.backDate) args.backDate = params.backDate;
  if (params.journeyType) args.journeyType = params.journeyType;
  if (params.seatClassName) args.seatClassName = params.seatClassName;
  if (params.maxPrice) args.maxPrice = params.maxPrice;
  if (params.sortType) args.sortType = params.sortType;
  
  return callMCP('search_domestic_train', args);
}

/**
 * 搜索酒店
 */
export async function searchHotels(params: {
  destName: string;
  checkInDate?: string;
  checkOutDate?: string;
  keyWords?: string;
  hotelTypes?: string;
  maxPrice?: number;
  hotelStars?: string;
}): Promise<unknown> {
  const args: Record<string, unknown> = { destName: params.destName };
  
  if (params.checkInDate) args.checkInDate = params.checkInDate;
  if (params.checkOutDate) args.checkOutDate = params.checkOutDate;
  if (params.keyWords) args.keyWords = params.keyWords;
  if (params.hotelTypes) args.hotelTypes = params.hotelTypes;
  if (params.maxPrice) args.maxPrice = params.maxPrice;
  if (params.hotelStars) args.hotelStars = params.hotelStars;
  
  return callMCP('search_hotels', args);
}

/**
 * 搜索景点
 */
export async function searchPOIs(params: {
  cityName: string;
  poiLevel?: number;
  keyword?: string;
  category?: string;
}): Promise<unknown> {
  const args: Record<string, unknown> = { cityName: params.cityName };
  
  if (params.poiLevel) args.poiLevel = params.poiLevel;
  if (params.keyword) args.keyword = params.keyword;
  if (params.category) args.category = params.category;
  
  return callMCP('search_poi', args);
}

/**
 * AI 语义搜索 (最通用)
 */
export async function aiSearch(query: string): Promise<unknown> {
  return callMCP('fliggy_ai_search', { query });
}

/**
 * 关键词快速搜索
 */
export async function keywordSearch(query: string): Promise<unknown> {
  return callMCP('fliggy_fast_search', { query });
}

export default {
  searchFlights,
  searchTrains,
  searchHotels,
  searchPOIs,
  aiSearch,
  keywordSearch,
};
