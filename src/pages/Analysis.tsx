import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, PieChart, Calendar, Filter,
  Download, FileText, AlertTriangle, AlertCircle,
  AlertOctagon, Info, ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useWarningStore, WarningLevel, categoryConfig, levelConfig } from '../store/warningStore';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

export default function Analysis() {
  const { rules, records } = useWarningStore();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 统计数据
  const stats = useMemo(() => {
    const filteredRecords = selectedCategory === 'all' 
      ? records 
      : records.filter(r => {
          const rule = rules.find(rule => rule.id === r.ruleId);
          return rule?.category === selectedCategory;
        });

    return {
      total: filteredRecords.length,
      byLevel: {
        red: filteredRecords.filter(r => r.level === 'red').length,
        orange: filteredRecords.filter(r => r.level === 'orange').length,
        yellow: filteredRecords.filter(r => r.level === 'yellow').length,
        blue: filteredRecords.filter(r => r.level === 'blue').length,
      },
      byStatus: {
        pending: filteredRecords.filter(r => r.status === 'pending').length,
        processing: filteredRecords.filter(r => r.status === 'processing').length,
        resolved: filteredRecords.filter(r => r.status === 'resolved').length,
      }
    };
  }, [records, rules, selectedCategory]);

  // 按分类统计
  const categoryData = useMemo(() => {
    return Object.keys(categoryConfig).map(cat => ({
      name: cat,
      count: records.filter(r => {
        const rule = rules.find(rule => rule.id === r.ruleId);
        return rule?.category === cat;
      }).length,
      rules: rules.filter(r => r.category === cat).length
    })).sort((a, b) => b.count - a.count);
  }, [records, rules]);

  // 趋势数据（模拟）
  const trendData = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    return months.map(month => ({
      month,
      red: Math.floor(Math.random() * 5) + 1,
      orange: Math.floor(Math.random() * 8) + 3,
      yellow: Math.floor(Math.random() * 12) + 5,
      blue: Math.floor(Math.random() * 6) + 2,
    }));
  }, []);

  // 级别分布数据
  const levelData = [
    { name: '红色预警', value: stats.byLevel.red, color: '#ef4444' },
    { name: '橙色预警', value: stats.byLevel.orange, color: '#f97316' },
    { name: '黄色预警', value: stats.byLevel.yellow, color: '#eab308' },
    { name: '蓝色预警', value: stats.byLevel.blue, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  // 处理状态数据
  const statusData = [
    { name: '待处理', value: stats.byStatus.pending, color: '#ef4444' },
    { name: '处理中', value: stats.byStatus.processing, color: '#f59e0b' },
    { name: '已解决', value: stats.byStatus.resolved, color: '#22c55e' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">数据分析</h1>
          <p className="text-slate-500 mt-1">预警数据统计与趋势分析</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="week">最近7天</option>
            <option value="month">最近30天</option>
            <option value="quarter">最近3个月</option>
            <option value="year">最近1年</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">全部分类</option>
            {Object.keys(categoryConfig).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
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
              <p className="text-sm text-slate-500">预警总数</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="text-slate-400 ml-1">较上期</span>
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
              <p className="text-sm text-slate-500">红色预警</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.byLevel.red}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            占比 {stats.total > 0 ? Math.round(stats.byLevel.red / stats.total * 100) : 0}%
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
              <p className="text-sm text-slate-500">待处理</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.byStatus.pending}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            需及时关注
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
              <p className="text-sm text-slate-500">已解决</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.byStatus.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            处理率 {stats.total > 0 ? Math.round(stats.byStatus.resolved / stats.total * 100) : 0}%
          </div>
        </motion.div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 趋势分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              预警趋势分析
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="red" stroke="#ef4444" name="红色预警" strokeWidth={2} />
                <Line type="monotone" dataKey="orange" stroke="#f97316" name="橙色预警" strokeWidth={2} />
                <Line type="monotone" dataKey="yellow" stroke="#eab308" name="黄色预警" strokeWidth={2} />
                <Line type="monotone" dataKey="blue" stroke="#3b82f6" name="蓝色预警" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 级别分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              预警级别分布
            </h3>
          </div>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 分类统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            分类预警统计
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="触发次数" radius={[0, 4, 4, 0]} />
              <Bar dataKey="rules" fill="#94a3b8" name="规则数量" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 数据表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">分类详情</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">规则数量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">触发次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">占比</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">趋势</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categoryData.map((cat, index) => (
                <tr key={cat.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-slate-800">{cat.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{cat.rules}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{cat.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${stats.total > 0 ? (cat.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">
                        {stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center text-sm ${
                      index % 3 === 0 ? 'text-green-600' : index % 3 === 1 ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${index % 3 === 1 ? 'rotate-180' : ''}`} />
                      {index % 3 === 0 ? '+5%' : index % 3 === 1 ? '-3%' : '0%'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
