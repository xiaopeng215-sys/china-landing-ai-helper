'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchFlights, searchTrains, type FlightResult, type TrainResult } from '@/lib/flyai';

// ─── Flight Result Card ────────────────────────────────────────────────────

function FlightCard({ result }: { result: FlightResult }) {
  const seg = result.segments[0];
  if (!seg) return null;

  const depTime = seg.depDateTime.split(' ')[1]?.slice(0, 5) || '';
  const arrTime = seg.arrDateTime.split(' ')[1]?.slice(0, 5) || '';
  const depDate = seg.depDateTime.split(' ')[0] || '';
  const durationMin = parseInt(result.totalDuration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 mb-3 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Left: Time + Route */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-bold text-foreground">{depTime}</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">{seg.depCityName}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-primary">{result.totalDuration}分钟</span>
                <span className="text-muted-foreground">—</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${result.journeyType === '直达' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {result.journeyType}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{arrTime}</span>
            </div>
            <span className="text-xl font-bold text-foreground">{arrTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{seg.depStationName}</span>
            {seg.depTerm && <span className="text-xs bg-muted px-1 rounded">T{seg.depTerm}</span>}
            <span>→</span>
            <span>{seg.arrStationName}</span>
            {seg.arrTerm && <span className="text-xs bg-muted px-1 rounded">T{seg.arrTerm}</span>}
          </div>
        </div>

        {/* Right: Price + Book */}
        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">¥{result.ticketPrice}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{seg.marketingTransportName} {seg.marketingTransportNo}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{seg.seatClassName}</span>
          </div>
          <a
            href={result.jumpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            预订
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Train Result Card ─────────────────────────────────────────────────────

function TrainCard({ result }: { result: TrainResult }) {
  const seg = result.segments[0];
  if (!seg) return null;

  const depTime = seg.depDateTime.split(' ')[1]?.slice(0, 5) || '';
  const arrTime = seg.arrDateTime.split(' ')[1]?.slice(0, 5) || '';
  const durationMin = parseInt(result.totalDuration);
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 mb-3 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Left: Time + Route */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-bold text-foreground">{depTime}</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">{seg.depCityName}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-primary">
                  {hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`}
                </span>
                <span className="text-muted-foreground">—</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${result.journeyType === '直达' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {result.journeyType}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{arrTime}</span>
            </div>
            <span className="text-xl font-bold text-foreground">{arrTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{seg.depStationName}</span>
            <span>→</span>
            <span>{seg.arrStationName}</span>
          </div>
        </div>

        {/* Right: Price + Book */}
        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">¥{result.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{seg.marketingTransportNo}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{seg.seatClassName}</span>
          </div>
          <a
            href={result.jumpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            预订
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Search Component ─────────────────────────────────────────────────

type Tab = 'flight' | 'train';

export default function TravelSearch() {
  const [activeTab, setActiveTab] = useState<Tab>('flight');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [depDate, setDepDate] = useState('');
  const [results, setResults] = useState<FlightResult[] | TrainResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!origin.trim()) {
      setError('请输入出发城市');
      return;
    }
    if (!destination.trim()) {
      setError('请输入目的地城市');
      return;
    }
    if (!depDate) {
      setError('请选择出发日期');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      if (activeTab === 'flight') {
        const data = await searchFlights({
          origin,
          destination,
          depDate,
          sortType: 3, // 价格低→高
        });
        setResults(data);
      } else {
        const data = await searchTrains({
          origin,
          destination,
          depDate,
          sortType: 3, // 价格低→高
        });
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || '搜索失败，请稍后重试');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        {(['flight', 'train'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab === 'flight' ? '✈️ 机票' : '🚄 高铁'}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              出发城市
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder={activeTab === 'flight' ? '如：北京' : '如：北京'}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              目的地
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={activeTab === 'flight' ? '如：上海' : '如：上海'}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              出发日期
            </label>
            <input
              type="date"
              value={depDate}
              onChange={(e) => setDepDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '搜索中...' : '🔍 搜索'}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">正在查询 FlyAI 数据...</p>
          </motion.div>
        ) : searched && results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            未找到相关结果，请尝试其他城市或日期
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {activeTab === 'flight' ? '✈️ 机票' : '🚄 高铁'}搜索结果
              </h2>
              <span className="text-sm text-muted-foreground">
                共 {results.length} 个选项 · 按价格排序
              </span>
            </div>

            <div className="space-y-3">
              {results.slice(0, 10).map((result, idx) =>
                activeTab === 'flight' ? (
                  <FlightCard key={idx} result={result as FlightResult} />
                ) : (
                  <TrainCard key={idx} result={result as TrainResult} />
                )
              )}
            </div>

            {results.length > 10 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                展示前 10 条结果，完整结果请点击各行的「预订」跳转飞猪查看
              </p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* FlyAI Attribution */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        基于 FlyAI (fliggy MCP) 实时数据 · 价格以飞猪实际为准
      </p>
    </div>
  );
}
