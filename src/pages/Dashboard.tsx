import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, AlertCircle, AlertOctagon, Info,
  TrendingUp, Activity, ArrowRight, Shield,
  FileText, Users, Briefcase, ShoppingCart, Building2, Wallet, Flag, BarChart3,
  XCircle, Eye, Clock, CheckCircle, User, Phone, Mail, MapPin,
  MessageSquare, Send, CheckSquare, History, Paperclip, Download,
  ChevronRight, Building
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useWarningStore, WarningLevel, levelConfig, WarningRecord } from '../store/warningStore';

const trendData = [
  { month: '1月', red: 3, orange: 8, yellow: 12, blue: 5 },
  { month: '2月', red: 2, orange: 6, yellow: 10, blue: 4 },
  { month: '3月', red: 4, orange: 9, yellow: 15, blue: 6 },
  { month: '4月', red: 2, orange: 7, yellow: 11, blue: 5 },
  { month: '5月', red: 5, orange: 10, yellow: 14, blue: 7 }
];

const trendSeries = [
  { key: 'red', label: '红色预警', stroke: '#ef4444', fill: 'url(#colorRed)' },
  { key: 'orange', label: '橙色预警', stroke: '#f97316', fill: 'url(#colorOrange)' },
  { key: 'yellow', label: '黄色预警', stroke: '#eab308', fill: '#fef08a' },
  { key: 'blue', label: '蓝色预警', stroke: '#3b82f6', fill: '#dbeafe' },
] as const;

// 9个监管模块配置
const modules = [
  { name: '财务风险', path: '/financial', icon: TrendingUp, color: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
  { name: '三重一大', path: '/triple-one', icon: FileText, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
  { name: '招聘人事', path: '/personnel', icon: Users, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
  { name: '投资项目', path: '/investment', icon: Briefcase, color: 'from-indigo-500 to-blue-500', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { name: '招标采购', path: '/procurement', icon: ShoppingCart, color: 'from-amber-500 to-yellow-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  { name: '资产管理', path: '/assets', icon: Building2, color: 'from-teal-500 to-cyan-500', bgColor: 'bg-teal-50', iconColor: 'text-teal-600' },
  { name: '资金司库', path: '/treasury', icon: Wallet, color: 'from-rose-500 to-pink-500', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  { name: '党建廉洁', path: '/party', icon: Flag, color: 'from-red-600 to-red-400', bgColor: 'bg-red-50', iconColor: 'text-red-700' },
  { name: '综合监管', path: '/comprehensive', icon: BarChart3, color: 'from-slate-500 to-gray-500', bgColor: 'bg-slate-50', iconColor: 'text-slate-600' },
];

const statusConfig = {
  pending: { label: '待处理', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Clock },
  processing: { label: '处理中', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
  resolved: { label: '已解决', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { records, rules } = useWarningStore();
  const [selectedRecord, setSelectedRecord] = useState<WarningRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'history'>('overview');

  // 统计各预警级别数量
  const stats = {
    red: records.filter(r => r.level === 'red').length,
    orange: records.filter(r => r.level === 'orange').length,
    yellow: records.filter(r => r.level === 'yellow').length,
    blue: records.filter(r => r.level === 'blue').length
  };

  // 获取最近预警（显示具体事项）
  const recentWarnings = records.slice(0, 8);

  // 获取各模块的预警数量
  const getModuleWarningCount = (moduleName: string) => {
    return records.filter(r => r.category === moduleName && r.status !== 'resolved').length;
  };

  const trendTotals = trendData.map((item) => item.red + item.orange + item.yellow + item.blue);
  const latestTrendTotal = trendTotals[trendTotals.length - 1];
  const previousTrendTotal = trendTotals[trendTotals.length - 2] ?? latestTrendTotal;
  const trendDelta = latestTrendTotal - previousTrendTotal;

  const getLevelIcon = (level: WarningLevel) => {
    const config = levelConfig[level];
    switch (config.icon) {
      case 'AlertOctagon': return <AlertOctagon className="w-5 h-5" style={{ color: config.color }} />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" style={{ color: config.color }} />;
      case 'AlertCircle': return <AlertCircle className="w-5 h-5" style={{ color: config.color }} />;
      case 'Info': return <Info className="w-5 h-5" style={{ color: config.color }} />;
      default: return <AlertCircle className="w-5 h-5" style={{ color: config.color }} />;
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* 预警统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['red', 'orange', 'yellow', 'blue'] as WarningLevel[]).map((level, index) => {
          const config = levelConfig[level];
          return (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{config.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${config.text}`}>{stats[level]}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center`}>
                  {getLevelIcon(level)}
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Activity className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-500">本月新增</span>
                <span className="text-red-500 ml-1">+{Math.floor(Math.random() * 5) + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 模块快捷入口 - 3x3 网格布局 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">监管模块快捷入口</h3>
            <p className="text-sm text-slate-500 mt-1">点击模块查看详细预警规则和实时数据</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            <span>共 {modules.length} 个监管领域</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const warningCount = getModuleWarningCount(module.name);
            return (
              <motion.button
                key={module.name}
                onClick={() => navigate(module.path)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="relative p-4 rounded-xl bg-gradient-to-br text-white overflow-hidden group text-left"
                style={{ 
                  background: `linear-gradient(135deg, ${module.color.includes('red') && module.name === '财务风险' ? '#ef4444' : 
                    module.color.includes('purple') ? '#a855f7' : 
                    module.color.includes('green') ? '#22c55e' : 
                    module.color.includes('indigo') ? '#6366f1' : 
                    module.color.includes('amber') ? '#f59e0b' : 
                    module.color.includes('teal') ? '#14b8a6' :
                    module.color.includes('rose') ? '#f43f5e' :
                    module.name === '党建廉洁' ? '#dc2626' : '#64748b'}, 
                    ${module.color.includes('red') && module.name === '财务风险' ? '#f97316' : 
                    module.color.includes('purple') ? '#ec4899' : 
                    module.color.includes('green') ? '#10b981' : 
                    module.color.includes('indigo') ? '#3b82f6' : 
                    module.color.includes('amber') ? '#eab308' : 
                    module.color.includes('teal') ? '#06b6d4' :
                    module.color.includes('rose') ? '#ec4899' :
                    module.name === '党建廉洁' ? '#ef4444' : '#94a3b8'})` 
                }}
              >
                <div className="relative z-10">
                  <Icon className="w-6 h-6 mb-2 opacity-90" />
                  <p className="font-semibold text-sm">{module.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">{warningCount}</span>
                    <span className="text-xs text-white/70">条预警</span>
                  </div>
                </div>
                {warningCount > 0 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* 最近预警 - 放在模块下方 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">最近预警事件</h3>
              <p className="text-sm text-slate-500 mt-1">显示具体触发事项、规则和时间</p>
            </div>
            <button 
              onClick={() => navigate('/records')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentWarnings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Shield className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>暂无预警事件</p>
              </div>
            ) : (
              recentWarnings.map((warning, index) => {
                const config = levelConfig[warning.level];
                return (
                  <motion.div
                    key={warning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    onClick={() => {setSelectedRecord(warning); setActiveTab('overview');}}
                  >
                    <div className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center flex-shrink-0`}>
                      {getLevelIcon(warning.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800 truncate">{warning.ruleName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgClass} ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{warning.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">{warning.category}</span>
                        <span className="text-xs text-slate-300">|</span>
                        <span className="text-xs text-slate-400">{formatTime(warning.triggerTime)}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                      warning.status === 'pending' ? 'bg-red-100 text-red-600' :
                      warning.status === 'processing' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {warning.status === 'pending' ? '待处理' : warning.status === 'processing' ? '处理中' : '已解决'}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* 预警趋势 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="self-start bg-white rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">预警趋势</h3>
                <p className="mt-1 text-sm text-slate-500">近 5 个月预警波动与层级分布</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                <Activity className="w-4 h-4" />
                <span>近5个月</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">本月预警总数</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-slate-800">{latestTrendTotal}</span>
                  <span className={`text-xs font-medium ${trendDelta >= 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {trendDelta >= 0 ? '+' : ''}{trendDelta} 较上月
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 px-4 py-3">
                <p className="text-xs text-slate-500">高风险占比</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-slate-800">
                    {Math.round(((trendData[trendData.length - 1].red + trendData[trendData.length - 1].orange) / latestTrendTotal) * 100)}%
                  </span>
                  <span className="text-xs font-medium text-blue-600">红橙预警</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {trendSeries.map((series) => (
                <span
                  key={series.key}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.stroke }} />
                  {series.label}
                </span>
              ))}
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="h-[280px] rounded-xl bg-gradient-to-b from-slate-50 to-white px-2 pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe4f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                      padding: '10px 12px'
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: 6 }}
                  />
                  {trendSeries.map((series) => (
                    <Area
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stackId="1"
                      stroke={series.stroke}
                      fill={series.fill}
                      strokeWidth={1.8}
                      name={series.label}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 预警详情弹窗 */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* 头部 */}
              <div className={`px-6 py-4 border-b ${levelConfig[selectedRecord.level].borderClass} bg-gradient-to-r ${
                selectedRecord.level === 'red' ? 'from-red-50 to-white' :
                selectedRecord.level === 'orange' ? 'from-orange-50 to-white' :
                selectedRecord.level === 'yellow' ? 'from-yellow-50 to-white' :
                'from-blue-50 to-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${levelConfig[selectedRecord.level].bgClass} flex items-center justify-center`}>
                      {getLevelIcon(selectedRecord.level)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{selectedRecord.ruleName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${levelConfig[selectedRecord.level].bgClass} ${levelConfig[selectedRecord.level].text}`}>
                          {levelConfig[selectedRecord.level].label}
                        </span>
                        <span className="text-xs text-slate-500">{selectedRecord.category}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Tab 导航 */}
              <div className="flex border-b border-slate-200">
                {[
                  { id: 'overview', label: '概览信息', icon: Eye },
                  { id: 'data', label: '关联数据', icon: Building },
                  { id: 'history', label: '处理记录', icon: History },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-500 border-transparent hover:text-slate-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 内容区域 */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 状态卡片 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">当前状态</p>
                        <div className="flex items-center gap-2">
                          {React.createElement(statusConfig[selectedRecord.status].icon, { 
                            className: `w-5 h-5 ${statusConfig[selectedRecord.status].color}` 
                          })}
                          <span className={`font-medium ${statusConfig[selectedRecord.status].color}`}>
                            {statusConfig[selectedRecord.status].label}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">触发时间</p>
                        <p className="font-medium text-slate-800">
                          {new Date(selectedRecord.triggerTime).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>

                    {/* 触发详情 */}
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        触发详情
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">涉及企业</span>
                          <span className="font-medium text-slate-800">XX集团</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">触发值</span>
                          <span className="font-medium text-red-600">500万元</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">预警阈值</span>
                          <span className="font-medium text-slate-800">单笔支付超过300万元</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-500">监测来源</span>
                          <span className="font-medium text-slate-800">资金司库系统</span>
                        </div>
                      </div>
                    </div>

                    {/* 描述 */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h4 className="font-medium text-slate-800 mb-2">预警描述</h4>
                      <p className="text-sm text-slate-700">{selectedRecord.description}</p>
                    </div>

                    {/* 处理信息 */}
                    {selectedRecord.status !== 'pending' && (
                      <div className="p-4 border border-slate-200 rounded-xl">
                        <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          处理信息
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">处理人</span>
                            <span className="font-medium text-slate-800">张经理</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">处理时间</span>
                            <span className="font-medium text-slate-800">2026-05-12 14:30:00</span>
                          </div>
                          {selectedRecord.status === 'resolved' && (
                            <div className="flex justify-between py-2">
                              <span className="text-slate-500">处理结果</span>
                              <span className="font-medium text-green-600">已核实并备案</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-6">
                    {/* 企业信息 */}
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        企业信息
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">联系人</p>
                            <p className="text-sm font-medium text-slate-800">张经理</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">联系电话</p>
                            <p className="text-sm font-medium text-slate-800">138****8888</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">邮箱</p>
                            <p className="text-sm font-medium text-slate-800">contact@company.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">地址</p>
                            <p className="text-sm font-medium text-slate-800">总部大楼A座</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 关联文档 */}
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-purple-500" />
                        关联文档
                      </h4>
                      <div className="space-y-2">
                        {['支付审批单.pdf', '资金计划表.xlsx', '会议纪要.docx'].map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-700">{doc}</span>
                            </div>
                            <Download className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                        <History className="w-4 h-4 text-green-500" />
                        处理记录
                      </h4>
                      <div className="space-y-4">
                        {[
                          { time: '2026-05-12 11:00:00', action: '触发预警', operator: '系统', type: 'trigger' },
                          { time: '2026-05-12 11:05:00', action: '通知财务负责人', operator: '系统', type: 'notify' },
                          ...(selectedRecord.status !== 'pending' ? [{ time: '2026-05-12 14:30:00', action: selectedRecord.status === 'resolved' ? '标记为已解决' : '开始处理', operator: '张经理', type: 'handle' }] : []),
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${
                                item.type === 'trigger' ? 'bg-red-500' : 
                                item.type === 'notify' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`} />
                              {i < 2 && (
                                <div className="w-0.5 h-full bg-slate-200 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="text-sm font-medium text-slate-800">{item.action}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500">{item.operator}</span>
                                <span className="text-xs text-slate-400">{item.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 备注 */}
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-500" />
                        备注说明
                      </h4>
                      <textarea
                        placeholder="添加备注..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          添加备注
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部操作按钮 */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  关闭
                </button>
                <div className="flex gap-3">
                  {selectedRecord.status === 'pending' && (
                    <>
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                        <CheckSquare className="w-4 h-4" />
                        开始处理
                      </button>
                    </>
                  )}
                  {selectedRecord.status === 'processing' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      标记解决
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                    通知相关人员
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
