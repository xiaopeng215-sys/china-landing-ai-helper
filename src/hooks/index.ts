/**
 * Hooks 导出
 */

// 实时查询核心 Hook
export {
  useRealtimeQuery,
  useRealtimeQueries,
} from './useRealtimeQuery';

export type {
  UseRealtimeQueryOptions,
  UseRealtimeQueryReturn,
} from './useRealtimeQuery';

// 实时聊天 Hook
export { useRealtimeChat } from './useRealtimeChat';

// 实时行程 Hook
export { useRealtimeTrips } from './useRealtimeTrips';

// 现有数据 Hooks
export { useChatData } from './useChatData';
export { useTripData } from './useTripData';
export { useFoodData } from './useFoodData';
export { useAttractionData } from './useAttractionData';
export { useTransportData } from './useTransportData';
export { useTripGeneration } from './useTripGeneration';
