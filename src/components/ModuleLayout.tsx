import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, AlertCircle, Info, AlertOctagon, 
  FileText, ChevronDown, ChevronUp, Clock, Database, 
  Shield, CheckCircle2, XCircle, Filter, Search,
  Bell, Settings, ArrowRight, Eye, Building2, User, Phone, Mail, MapPin,
  MessageSquare, Send, CheckSquare, History, Paperclip, Download,
  Building
} from 'lucide-react';
import { useWarningStore, WarningLevel, WarningRule, levelConfig, WarningRecord } from '../store/warningStore';

const statusConfig = {
  pending: { label: '待处理', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Clock },
  processing: { label: '处理中', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
  resolved: { label: '已解决', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2 },
};

interface ModuleLayoutProps {
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
  gradientColor: string;
  rules: WarningRule[];
  children?: React.ReactNode;
}

export default function ModuleLayout({
  title,
  description,
  category,
  icon: Icon,
  iconColor,
  gradientColor,
  rules,
  children
}: ModuleLayoutProps) {
  const { records } = useWarningStore();
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<WarningLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<WarningRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'history'>('overview');

  // 统计各级别预警数量
  const stats = {
    red: rules.filter(r => r.level === 'red').length,
    orange: rules.filter(r => r.level === 'orange').length,
    yellow: rules.filter(r => r.level === 'yellow').length,
    blue: rules.filter(r => r.level === 'blue').length,
  };

  // 过滤规则
  const filteredRules = rules.filter(rule => {
    if (filterLevel !== 'all' && rule.level !== filterLevel) return false;
    if (searchTerm && !rule.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // 获取该分类的活跃预警记录
  const activeRecords = records.filter(r => r.category === category && r.status !== 'resolved');

  const getLevelIcon = (level: WarningLevel) => {
    switch (level) {
      case 'red': return <AlertOctagon className="w-5 h-5" />;
      case 'orange': return <AlertTriangle className="w-5 h-5" />;
      case 'yellow': return <AlertCircle className="w-5 h-5" />;
      case 'blue': return <Info className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: WarningLevel) => {
    switch (level) {
      case 'red': return 'from-red-500 to-rose-500';
      case 'orange': return 'from-orange-500 to-amber-500';
      case 'yellow': return 'from-yellow-500 to-amber-400';
      case 'blue': return 'from-blue-500 to-cyan-500';
    }
  };

  const getLevelLightColor = (level: WarningLevel) => {
    switch (level) {
      case 'red': return 'bg-red-50 border-red-100';
      case 'orange': return 'bg-orange-50 border-orange-100';
      case 'yellow': return 'bg-yellow-50 border-yellow-100';
      case 'blue': return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">
            共 {rules.length} 条规则
          </span>
        </div>
      </motion.div>

      {/* 预警规则统计 - 点击可筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">预警规则配置</h3>
              <p className="text-sm text-slate-500">共 {rules.length} 条规则，按预警级别分布</p>
            </div>
          </div>
          {filterLevel !== 'all' && (
            <button
              onClick={() => setFilterLevel('all')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['red', 'orange', 'yellow', 'blue'] as WarningLevel[]).map((level, index) => {
            const config = levelConfig[level];
            const count = stats[level];
            const isActive = filterLevel === level;
            return (
              <motion.button
                key={level}
                onClick={() => setFilterLevel(isActive ? 'all' : level)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all text-left ${
                  isActive 
                    ? `${config.borderClass} shadow-md` 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${config.bgClass} flex items-center justify-center`}>
                    {getLevelIcon(level)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{config.label}</p>
                    <p className={`text-2xl font-bold ${config.text}`}>{count} <span className="text-xs font-normal text-slate-400">条规则</span></p>
                  </div>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getLevelColor(level)}`}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* 筛选状态提示 */}
        {filterLevel !== 'all' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              当前筛选：<span className="font-medium">{levelConfig[filterLevel].label}</span>
              <span className="text-blue-600 ml-1">（显示 {filteredRules.length} 条）</span>
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* 活跃预警 - 可点击 */}
      {activeRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">实时预警</h3>
                <p className="text-sm text-slate-500">{activeRecords.length} 条待处理预警</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {activeRecords.slice(0, 5).map((record) => {
              const config = levelConfig[record.level];
              return (
                <div 
                  key={record.id} 
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => {setSelectedRecord(record); setActiveTab('overview');}}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center`}>
                      {getLevelIcon(record.level)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800">{record.ruleName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgClass} ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{record.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(record.triggerTime).toLocaleString('zh-CN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                      record.status === 'pending' ? 'bg-red-100 text-red-600' :
                      record.status === 'processing' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {record.status === 'pending' ? '待处理' : record.status === 'processing' ? '处理中' : '已解决'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 自定义内容 */}
      {children}

      {/* 规则列表 - 全新设计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* 头部 */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">规则详情</h3>
                <p className="text-sm text-slate-500">
                  {filterLevel === 'all' 
                    ? `共 ${rules.length} 条预警规则` 
                    : `显示 ${filteredRules.length} 条${levelConfig[filterLevel].label}规则（共 ${rules.length} 条）`}
                </p>
              </div>
            </div>
            
            {/* 搜索框 */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索规则..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-48"
                />
              </div>
              {filterLevel !== 'all' && (
                <button
                  onClick={() => setFilterLevel('all')}
                  className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl transition-colors"
                >
                  清除筛选
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 规则卡片网格 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRules.map((rule, index) => {
                const config = levelConfig[rule.level];
                const isExpanded = expandedRule === rule.id;
                
                return (
                  <motion.div
                    key={rule.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                    className={`group relative rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                      isExpanded 
                        ? `${getLevelLightColor(rule.level)} shadow-lg` 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* 左侧级别指示条 */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${getLevelColor(rule.level)}`} />
                    
                    <div className="p-5 pl-6">
                      {/* 头部信息 */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center flex-shrink-0`}>
                            {getLevelIcon(rule.level)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {rule.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${config.bgClass} ${config.text}`}>
                                {config.label}
                              </span>
                              {rule.enabled ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle2 className="w-3 h-3" />
                                  已启用
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-500">
                                  <XCircle className="w-3 h-3" />
                                  已禁用
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* 触发条件预览 */}
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-500 flex-shrink-0">触发条件：</span>
                        <span className="text-slate-700 truncate">{rule.condition}</span>
                      </div>

                      {/* 展开详情 */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-slate-200/60 space-y-3">
                              {/* 详细条件 */}
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                  <Database className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-500 mb-1">数据源</p>
                                  <p className="text-sm text-slate-700">{rule.source}</p>
                                </div>
                              </div>

                              {/* 监测频率 */}
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                  <Clock className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-500 mb-1">监测频率</p>
                                  <p className="text-sm text-slate-700">{rule.frequency}</p>
                                </div>
                              </div>

                              {/* 处置要求 */}
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-500 mb-1">处置要求</p>
                                  <p className="text-sm text-slate-700">{rule.action}</p>
                                </div>
                              </div>

                              {/* 政策依据 */}
                              {rule.policyBasis && (
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-slate-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs text-slate-500 mb-1">政策依据</p>
                                    <p className="text-sm text-slate-700">{rule.policyBasis}</p>
                                    {rule.policyClause && (
                                      <p className="text-xs text-slate-500 mt-0.5">{rule.policyClause}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* 描述 */}
                              {rule.description && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                                  <p className="text-xs text-slate-500 mb-1">规则说明</p>
                                  <p className="text-sm text-slate-700">{rule.description}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {filteredRules.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">未找到匹配的规则</p>
              <button
                onClick={() => {setFilterLevel('all'); setSearchTerm('');}}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                清除筛选条件
              </button>
            </div>
          )}
        </div>
      </motion.div>

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
                      <CheckCircle2 className="w-4 h-4" />
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
