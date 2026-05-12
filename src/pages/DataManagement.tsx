import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Server, Link2, RefreshCw, CheckCircle, AlertTriangle,
  FileText, Settings, Activity, TrendingUp, Shield, Clock,
  ChevronRight, ChevronDown, Search, Filter, Download,
  Plus, Edit2, Trash2, Play, Pause, MoreVertical,
  Layers, GitBranch, Zap, Box, Share2, Lock
} from 'lucide-react';

// 数据源类型
const dataSourceTypes = [
  { id: 'erp', name: 'ERP系统', icon: Database, color: 'bg-blue-500' },
  { id: 'finance', name: '财务系统', icon: FileText, color: 'bg-green-500' },
  { id: 'hr', name: '人事系统', icon: Shield, color: 'bg-purple-500' },
  { id: 'asset', name: '资产系统', icon: Box, color: 'bg-orange-500' },
  { id: 'procurement', name: '采购系统', icon: ShoppingCart, color: 'bg-pink-500' },
  { id: 'investment', name: '投资系统', icon: TrendingUp, color: 'bg-indigo-500' },
];

// 模拟数据源
const mockDataSources = [
  { id: 1, name: '集团ERP系统', type: 'erp', status: 'connected', lastSync: '2026-05-12 10:30:00', records: 125000, tables: 45 },
  { id: 2, name: '财务核算系统', type: 'finance', status: 'connected', lastSync: '2026-05-12 10:25:00', records: 89000, tables: 32 },
  { id: 3, name: '人力资源系统', type: 'hr', status: 'warning', lastSync: '2026-05-11 18:00:00', records: 5600, tables: 18 },
  { id: 4, name: '资产管理系统', type: 'asset', status: 'connected', lastSync: '2026-05-12 09:45:00', records: 23000, tables: 28 },
  { id: 5, name: '招标采购平台', type: 'procurement', status: 'error', lastSync: '2026-05-10 14:20:00', records: 4500, tables: 15 },
  { id: 6, name: '投资项目系统', type: 'investment', status: 'connected', lastSync: '2026-05-12 10:00:00', records: 1200, tables: 12 },
];

// 数据质量指标
const qualityMetrics = [
  { name: '完整性', value: 98.5, target: 95, status: 'good' },
  { name: '准确性', value: 96.2, target: 95, status: 'good' },
  { name: '一致性', value: 94.8, target: 95, status: 'warning' },
  { name: '及时性', value: 99.1, target: 98, status: 'good' },
];

// 数据血缘示例
const lineageData = {
  source: 'ERP系统',
  tables: [
    { name: '财务凭证表', type: 'source', status: 'active' },
    { name: '资金流水表', type: 'source', status: 'active' },
    { name: '费用报销表', type: 'source', status: 'active' },
  ],
  etl: 'ETL清洗转换',
  target: '国资监管数据仓库',
  applications: ['预警分析', '报表统计', '大屏展示'],
};

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState<'sources' | 'quality' | 'lineage' | 'integration'>('sources');
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '已连接';
      case 'warning': return '警告';
      case 'error': return '异常';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">数据管理</h1>
          <p className="text-slate-500 mt-1">数据治理、系统集成与数据质量管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          添加数据源
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">数据源</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">6</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">4</span>
            <span className="text-slate-500 ml-1">个正常</span>
            <span className="text-slate-300 mx-2">|</span>
            <span className="text-yellow-600 font-medium">1</span>
            <span className="text-slate-500 ml-1">个警告</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">数据表</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">150</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">今日同步</span>
            <span className="text-green-600 ml-1 font-medium">+12</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">数据质量</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">97.2%</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">↑ 0.5%</span>
            <span className="text-slate-500 ml-1">较上周</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">今日同步</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">2.4M</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">记录数</span>
          </div>
        </motion.div>
      </div>

      {/* Tab 导航 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'sources', label: '数据源管理', icon: Database },
            { id: 'quality', label: '数据质量', icon: CheckCircle },
            { id: 'lineage', label: '数据血缘', icon: GitBranch },
            { id: 'integration', label: '集成配置', icon: Link2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
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

        <div className="p-6">
          {/* 数据源管理 */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索数据源..."
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                    />
                  </div>
                  <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="all">全部状态</option>
                    <option value="connected">已连接</option>
                    <option value="warning">警告</option>
                    <option value="error">异常</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  刷新全部
                </button>
              </div>

              <div className="space-y-3">
                {mockDataSources.map((source) => {
                  const typeInfo = dataSourceTypes.find(t => t.id === source.type);
                  const isExpanded = expandedSource === source.id;
                  return (
                    <motion.div
                      key={source.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${typeInfo?.color || 'bg-slate-500'} rounded-lg flex items-center justify-center`}>
                            {typeInfo && <typeInfo.icon className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">{source.name}</h4>
                            <p className="text-sm text-slate-500">{typeInfo?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">最后同步</p>
                            <p className="text-sm text-slate-700">{source.lastSync}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                            <span className="text-sm text-slate-600">{getStatusText(source.status)}</span>
                          </div>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="border-t border-slate-200 bg-slate-50"
                          >
                            <div className="p-4 grid grid-cols-4 gap-4">
                              <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">数据表</p>
                                <p className="text-xl font-bold text-slate-800">{source.tables}</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">记录数</p>
                                <p className="text-xl font-bold text-slate-800">{(source.records / 1000).toFixed(1)}K</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">同步频率</p>
                                <p className="text-sm font-medium text-slate-800">每15分钟</p>
                              </div>
                              <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">数据质量</p>
                                <p className="text-xl font-bold text-green-600">98.5%</p>
                              </div>
                            </div>
                            <div className="px-4 pb-4 flex gap-2">
                              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                立即同步
                              </button>
                              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                                查看日志
                              </button>
                              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                                配置
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 数据质量 */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {qualityMetrics.map((metric) => (
                  <div key={metric.name} className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-500">{metric.name}</span>
                      {metric.status === 'good' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-slate-800">{metric.value}%</span>
                      <span className="text-sm text-slate-400 mb-1">/ {metric.target}%</span>
                    </div>
                    <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${metric.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-semibold text-slate-800">质量问题列表</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">问题类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">数据表</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">影响记录</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">严重程度</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800">数据缺失</td>
                      <td className="px-6 py-4 text-sm text-slate-600">财务凭证表</td>
                      <td className="px-6 py-4 text-sm text-slate-600">23条</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">中等</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">查看详情</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800">格式不一致</td>
                      <td className="px-6 py-4 text-sm text-slate-600">人员信息表</td>
                      <td className="px-6 py-4 text-sm text-slate-600">156条</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">低</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">查看详情</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 数据血缘 */}
          {activeTab === 'lineage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索数据表..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                  <Download className="w-4 h-4" />
                  导出血缘图
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-8">
                <div className="flex items-center justify-center gap-8">
                  {/* 数据源 */}
                  <div className="text-center">
                    <div className="w-32 h-20 bg-blue-500 rounded-xl flex items-center justify-center text-white font-medium mb-2">
                      {lineageData.source}
                    </div>
                    <span className="text-sm text-slate-500">数据源</span>
                  </div>

                  <ChevronRight className="w-8 h-8 text-slate-400" />

                  {/* 数据表 */}
                  <div className="space-y-2">
                    {lineageData.tables.map((table, i) => (
                      <div key={i} className="w-32 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center text-sm text-slate-700">
                        {table.name}
                      </div>
                    ))}
                  </div>

                  <ChevronRight className="w-8 h-8 text-slate-400" />

                  {/* ETL */}
                  <div className="text-center">
                    <div className="w-32 h-20 bg-purple-500 rounded-xl flex items-center justify-center text-white font-medium mb-2">
                      {lineageData.etl}
                    </div>
                    <span className="text-sm text-slate-500">数据处理</span>
                  </div>

                  <ChevronRight className="w-8 h-8 text-slate-400" />

                  {/* 目标 */}
                  <div className="text-center">
                    <div className="w-32 h-20 bg-green-500 rounded-xl flex items-center justify-center text-white font-medium mb-2 text-sm px-2">
                      {lineageData.target}
                    </div>
                    <span className="text-sm text-slate-500">数据仓库</span>
                  </div>

                  <ChevronRight className="w-8 h-8 text-slate-400" />

                  {/* 应用 */}
                  <div className="space-y-2">
                    {lineageData.applications.map((app, i) => (
                      <div key={i} className="w-28 h-10 bg-orange-100 border border-orange-200 rounded-lg flex items-center justify-center text-sm text-orange-700">
                        {app}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-medium text-slate-800 mb-3">上游依赖</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Database className="w-4 h-4" />
                      <span>ERP系统</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Database className="w-4 h-4" />
                      <span>财务系统</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-medium text-slate-800 mb-3">下游应用</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Activity className="w-4 h-4" />
                      <span>预警分析</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileText className="w-4 h-4" />
                      <span>报表统计</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-medium text-slate-800 mb-3">影响分析</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">影响表</span>
                      <span className="font-medium text-slate-800">12个</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">影响应用</span>
                      <span className="font-medium text-slate-800">5个</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 集成配置 */}
          {activeTab === 'integration' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">实时同步</h4>
                      <p className="text-sm text-slate-500">CDC变更数据捕获</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">同步延迟</span>
                      <span className="text-sm font-medium text-slate-800">&lt; 5秒</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">已配置表</span>
                      <span className="text-sm font-medium text-slate-800">45个</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">定时同步</h4>
                      <p className="text-sm text-slate-500">ETL批量处理</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">执行频率</span>
                      <span className="text-sm font-medium text-slate-800">每15分钟</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">已配置任务</span>
                      <span className="text-sm font-medium text-slate-800">28个</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-semibold text-slate-800">API接口管理</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">接口名称</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">请求方式</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">调用次数(今日)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800">财务数据查询</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">GET</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">12,456</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">正常</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">查看</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800">人员信息同步</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">POST</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">3,234</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">正常</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">查看</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 缺少的图标
function ShoppingCart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
