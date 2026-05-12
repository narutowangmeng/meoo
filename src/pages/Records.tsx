import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, AlertCircle, AlertOctagon, Info,
  Search, Filter, Calendar, CheckCircle, Clock,
  XCircle, ChevronDown, Download, Eye, FileText,
  Building2, User, Phone, Mail, MapPin, Link2,
  History, MessageSquare, Paperclip, ArrowRight,
  Shield, CheckSquare, XSquare, Send
} from 'lucide-react';
import { useWarningStore, WarningRecord, WarningLevel, levelConfig, categoryConfig } from '../store/warningStore';

const statusConfig = {
  pending: { label: '待处理', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Clock },
  processing: { label: '处理中', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
  resolved: { label: '已解决', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
};

// 生成更详细的模拟预警记录数据
const generateMockRecords = (rules: any[]): WarningRecord[] => {
  const records: WarningRecord[] = [];
  const now = new Date();
  
  const companies = ['XX集团', 'YY投资', 'ZZ建设', 'AA科技', 'BB能源'];
  const handlers = ['张经理', '李主任', '王科长', '赵专员'];
  
  rules.forEach((rule, index) => {
    // 每个规则生成 0-3 条记录
    const count = Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const triggerDate = new Date(now);
      triggerDate.setDate(triggerDate.getDate() - daysAgo);
      
      const statuses: ('pending' | 'processing' | 'resolved')[] = ['pending', 'processing', 'resolved'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      records.push({
        id: `record-${rule.id}-${i}`,
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        level: rule.level,
        triggerTime: triggerDate.toISOString(),
        status,
        description: `${company}${rule.description || rule.condition}，触发预警`,
        // 扩展字段
        company,
        triggeredValue: generateTriggeredValue(rule),
        threshold: rule.condition,
        handler: status !== 'pending' ? handlers[Math.floor(Math.random() * handlers.length)] : undefined,
        handleTime: status !== 'pending' ? new Date(triggerDate.getTime() + 3600000 * 2).toISOString() : undefined,
        handleResult: status === 'resolved' ? '已整改并提交报告' : undefined,
        relatedData: generateRelatedData(rule, company),
      });
    }
  });
  
  // 按时间倒序排列
  return records.sort((a, b) => new Date(b.triggerTime).getTime() - new Date(a.triggerTime).getTime());
};

// 生成触发值
const generateTriggeredValue = (rule: any) => {
  if (rule.condition?.includes('%')) {
    return (Math.random() * 20 + 5).toFixed(2) + '%';
  }
  if (rule.condition?.includes('万')) {
    return (Math.floor(Math.random() * 500) + 100) + '万元';
  }
  if (rule.condition?.includes('天')) {
    return (Math.floor(Math.random() * 30) + 1) + '天';
  }
  return '异常值';
};

// 生成关联数据
const generateRelatedData = (rule: any, company: string) => {
  return {
    department: '财务部',
    contact: '138****8888',
    email: 'finance@company.com',
    location: '总部大楼A座',
    documents: ['资产负债表.pdf', '现金流量表.xlsx'],
    history: [
      { time: '2026-05-10 09:00:00', action: '系统自动监测', operator: '系统' },
      { time: '2026-05-10 09:05:00', action: '触发预警', operator: '系统' },
    ]
  };
};

export default function Records() {
  const { rules, records: storeRecords, setRecords } = useWarningStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<WarningLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<WarningRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'history'>('overview');

  // 如果没有记录，生成模拟数据
  React.useEffect(() => {
    if (storeRecords.length === 0 && rules.length > 0) {
      const mockRecords = generateMockRecords(rules);
      setRecords(mockRecords);
    }
  }, [rules, storeRecords.length, setRecords]);

  // 过滤记录
  const filteredRecords = useMemo(() => {
    return storeRecords.filter(record => {
      if (searchTerm && !record.ruleName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterLevel !== 'all' && record.level !== filterLevel) return false;
      if (filterStatus !== 'all' && record.status !== filterStatus) return false;
      if (filterCategory !== 'all' && record.category !== filterCategory) return false;
      return true;
    });
  }, [storeRecords, searchTerm, filterLevel, filterStatus, filterCategory]);

  // 统计数据
  const stats = useMemo(() => ({
    total: storeRecords.length,
    pending: storeRecords.filter(r => r.status === 'pending').length,
    processing: storeRecords.filter(r => r.status === 'processing').length,
    resolved: storeRecords.filter(r => r.status === 'resolved').length,
  }), [storeRecords]);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">预警记录</h1>
          <p className="text-slate-500 mt-1">查看和管理所有预警事件</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          导出记录
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
              <p className="text-sm text-slate-500">预警总数</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
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
              <p className="text-sm text-slate-500">待处理</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
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
              <p className="text-sm text-slate-500">处理中</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{stats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
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
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 过滤器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索预警名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as WarningLevel | 'all')}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">所有级别</option>
            <option value="red">红色预警</option>
            <option value="orange">橙色预警</option>
            <option value="yellow">黄色预警</option>
            <option value="blue">蓝色预警</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">所有状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="resolved">已解决</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">所有分类</option>
            {Object.keys(categoryConfig).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* 记录列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">预警级别</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">预警名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">触发时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p>暂无预警记录</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const status = statusConfig[record.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getLevelIcon(record.level)}
                          <span className={`text-sm font-medium ${levelConfig[record.level].text}`}>
                            {levelConfig[record.level].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{record.ruleName}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs">{record.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {record.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {formatTime(record.triggerTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {setSelectedRecord(record); setActiveTab('overview');}}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 详情弹窗 - 全新设计 */}
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
                  { id: 'data', label: '关联数据', icon: Link2 },
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
                          <span className="font-medium text-slate-800">{(selectedRecord as any).company || 'XX集团'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">触发值</span>
                          <span className="font-medium text-red-600">{(selectedRecord as any).triggeredValue || '超标'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">预警阈值</span>
                          <span className="font-medium text-slate-800">{selectedRecord.threshold || selectedRecord.description}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-500">监测来源</span>
                          <span className="font-medium text-slate-800">财务系统</span>
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
                            <span className="font-medium text-slate-800">{(selectedRecord as any).handler || '待分配'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">处理时间</span>
                            <span className="font-medium text-slate-800">
                              {(selectedRecord as any).handleTime 
                                ? new Date((selectedRecord as any).handleTime).toLocaleString('zh-CN')
                                : '-'}
                            </span>
                          </div>
                          {selectedRecord.status === 'resolved' && (
                            <div className="flex justify-between py-2">
                              <span className="text-slate-500">处理结果</span>
                              <span className="font-medium text-green-600">{(selectedRecord as any).handleResult || '已解决'}</span>
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
                            <p className="text-sm font-medium text-slate-800">{(selectedRecord as any).relatedData?.contact || '138****8888'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">邮箱</p>
                            <p className="text-sm font-medium text-slate-800">{(selectedRecord as any).relatedData?.email || 'contact@company.com'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">地址</p>
                            <p className="text-sm font-medium text-slate-800">{(selectedRecord as any).relatedData?.location || '总部大楼'}</p>
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
                        {((selectedRecord as any).relatedData?.documents || ['资产负债表.pdf', '现金流量表.xlsx']).map((doc: string, i: number) => (
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
                        {((selectedRecord as any).relatedData?.history || [
                          { time: selectedRecord.triggerTime, action: '触发预警', operator: '系统', type: 'trigger' },
                          ...(selectedRecord.status !== 'pending' ? [{ time: (selectedRecord as any).handleTime, action: selectedRecord.status === 'resolved' ? '标记为已解决' : '开始处理', operator: (selectedRecord as any).handler || '管理员', type: 'handle' }] : []),
                        ]).map((item: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${
                                item.type === 'trigger' ? 'bg-red-500' : 'bg-green-500'
                              }`} />
                              {i < (((selectedRecord as any).relatedData?.history?.length || 2) - 1) && (
                                <div className="w-0.5 h-full bg-slate-200 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="text-sm font-medium text-slate-800">{item.action}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500">{item.operator}</span>
                                <span className="text-xs text-slate-400">{new Date(item.time).toLocaleString('zh-CN')}</span>
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
