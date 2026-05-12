import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Copy, Trash2, AlertOctagon, AlertTriangle, AlertCircle, Info, Clock, FileText, User, Calendar, Database } from 'lucide-react';
import { formatQuery } from 'react-querybuilder';
import { useWarningStore, WarningLevel, levelConfig, predefinedFacts } from '../store/warningStore';

interface RuleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ruleId: string | null;
  onEdit: (id: string) => void;
}

const getLevelIcon = (level: WarningLevel) => {
  switch (levelConfig[level].icon) {
    case 'AlertOctagon': return AlertOctagon;
    case 'AlertTriangle': return AlertTriangle;
    case 'AlertCircle': return AlertCircle;
    case 'Info': return Info;
    default: return AlertCircle;
  }
};

export default function RuleDetailDrawer({ isOpen, onClose, ruleId, onEdit }: RuleDetailDrawerProps) {
  const { rules, duplicateRule, deleteRule } = useWarningStore();
  
  const rule = ruleId ? rules.find(r => r.id === ruleId) : null;
  
  if (!rule) return null;
  
  const config = levelConfig[rule.level];
  const LevelIcon = getLevelIcon(rule.level);
  const fact = predefinedFacts.find(f => f.id === rule.factId);

  const handleDuplicate = () => {
    duplicateRule(rule.id);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('确定要删除这条规则吗？')) {
      deleteRule(rule.id);
      onClose();
    }
  };

  // 格式化查询条件为自然语言
  const conditionText = rule.query 
    ? formatQuery(rule.query, 'natural')
    : rule.condition;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          
          {/* 抽屉 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.bg }}
                >
                  <LevelIcon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">规则详情</h2>
                  <p className="text-sm text-slate-500">ID: {rule.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto">
              {/* 规则标题区 */}
              <div className="px-6 py-6 border-b border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-3">{rule.name}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    <LevelIcon className="w-4 h-4" />
                    {config.label}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {rule.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    rule.enabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {rule.enabled ? '已启用' : '已禁用'}
                  </span>
                </div>
              </div>

              {/* 规则详情 */}
              <div className="px-6 py-6 space-y-6">
                {/* 数据来源 */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Database className="w-4 h-4 text-purple-500" />
                    数据来源
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-800 font-medium">{fact?.name || '未知数据源'}</p>
                    <p className="text-slate-500 text-sm mt-1">{fact?.source || rule.source || ''}</p>
                  </div>
                </div>

                {/* 触发条件 */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    触发条件
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-800">{conditionText}</p>
                  </div>
                </div>

                {/* 规则结构（JSON展示） */}
                {rule.query && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      规则结构
                    </h3>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-xs font-mono">
                        <code>{JSON.stringify(rule.query, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* 触发频率 */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    触发频率
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-800">{rule.frequency}</p>
                  </div>
                </div>

                {/* 处置要求 */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <AlertOctagon className="w-4 h-4 text-red-500" />
                    处置要求
                  </h3>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <p className="text-red-800">{rule.action}</p>
                  </div>
                </div>

                {/* 制度依据 */}
                {rule.policyBasis && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      制度依据
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-800 font-medium">{rule.policyBasis}</p>
                      {rule.policyClause && (
                        <p className="text-slate-500 text-sm mt-1">{rule.policyClause}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 规则说明 */}
                {rule.description && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                      <Info className="w-4 h-4 text-teal-500" />
                      规则说明
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-600">{rule.description}</p>
                    </div>
                  </div>
                )}

                {/* 统计信息 */}
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    统计信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">创建时间</p>
                      <p className="text-sm text-slate-800">{new Date(rule.createdAt).toLocaleString('zh-CN')}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">更新时间</p>
                      <p className="text-sm text-slate-800">{new Date(rule.updatedAt).toLocaleString('zh-CN')}</p>
                    </div>
                    {rule.createdBy && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1">创建人</p>
                        <p className="text-sm text-slate-800">{rule.createdBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 底部操作栏 */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(rule.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑规则
                </button>
                <button
                  onClick={handleDuplicate}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  复制
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
