import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Plus, Search, Filter, MoreVertical,
  Play, Pause, Edit3, Trash2, Copy, Check, X,
  AlertTriangle, AlertCircle, Info, AlertOctagon,
  Code, FileText, Zap, Shield, Eye,
  ChevronDown, ChevronUp, Download, Upload,
  LayoutGrid, List, RefreshCw
} from 'lucide-react';
import { useWarningStore, WarningRule, WarningLevel, levelConfig, categoryConfig, frequencyOptions } from '../store/warningStore';
import RuleDetailDrawer from '../components/RuleDetailDrawer';
import RuleFormModal from '../components/RuleFormModal';

const categories = ['全部', ...Object.keys(categoryConfig)];

export default function RuleEngine() {
  const { 
    rules, 
    toggleRule, 
    deleteRule, 
    duplicateRule,
    batchEnable,
    batchDisable,
    batchDelete
  } = useWarningStore();
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedLevel, setSelectedLevel] = useState<WarningLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 视图状态
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);
  
  // 弹窗状态
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // 删除确认
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  // 筛选和排序规则
  const filteredRules = useMemo(() => {
    let result = rules.filter(rule => {
      const matchesSearch = !searchTerm || 
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '全部' || rule.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || rule.level === selectedLevel;
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'enabled' ? rule.enabled : !rule.enabled);
      
      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });

    // 排序
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [rules, searchTerm, selectedCategory, selectedLevel, selectedStatus, sortBy, sortOrder]);

  // 统计数据
  const stats = useMemo(() => {
    const total = rules.length;
    const enabled = rules.filter(r => r.enabled).length;
    const disabled = rules.filter(r => !r.enabled).length;
    
    const byLevel = {
      red: rules.filter(r => r.level === 'red').length,
      orange: rules.filter(r => r.level === 'orange').length,
      yellow: rules.filter(r => r.level === 'yellow').length,
      blue: rules.filter(r => r.level === 'blue').length
    };

    const byCategory = Object.keys(categoryConfig).map(cat => ({
      name: cat,
      count: rules.filter(r => r.category === cat).length,
      color: categoryConfig[cat].color
    }));

    return { total, enabled, disabled, byLevel, byCategory };
  }, [rules]);

  // 批量选择处理
  const handleSelectAll = () => {
    if (selectedRules.size === filteredRules.length) {
      setSelectedRules(new Set());
      setShowBatchActions(false);
    } else {
      setSelectedRules(new Set(filteredRules.map(r => r.id)));
      setShowBatchActions(true);
    }
  };

  const handleSelectRule = (id: string) => {
    const newSelected = new Set(selectedRules);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRules(newSelected);
    setShowBatchActions(newSelected.size > 0);
  };

  // 批量操作
  const handleBatchEnable = () => {
    batchEnable(Array.from(selectedRules));
    setSelectedRules(new Set());
    setShowBatchActions(false);
  };

  const handleBatchDisable = () => {
    batchDisable(Array.from(selectedRules));
    setSelectedRules(new Set());
    setShowBatchActions(false);
  };

  const handleBatchDelete = () => {
    batchDelete(Array.from(selectedRules));
    setSelectedRules(new Set());
    setShowBatchActions(false);
  };

  // 单条操作
  const handleViewDetail = (id: string) => {
    setSelectedRuleId(id);
    setDetailDrawerOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRuleId(id);
    setIsEditing(true);
    setFormModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRuleId(null);
    setIsEditing(false);
    setFormModalOpen(true);
  };

  const handleDuplicate = (id: string) => {
    duplicateRule(id);
  };

  const handleDeleteClick = (id: string) => {
    setRuleToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      deleteRule(ruleToDelete);
      setRuleToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const getLevelIcon = (level: WarningLevel) => {
    const config = levelConfig[level];
    switch (config.icon) {
      case 'AlertOctagon': return AlertOctagon;
      case 'AlertTriangle': return AlertTriangle;
      case 'AlertCircle': return AlertCircle;
      case 'Info': return Info;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计面板 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">规则引擎</h2>
                <p className="text-sm text-slate-500">管理AI预警规则，共 {stats.total} 条规则</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" />
                导入
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">规则总数</p>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">已启用</p>
              <p className="text-3xl font-bold text-green-600">{stats.enabled}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">已禁用</p>
              <p className="text-3xl font-bold text-slate-600">{stats.disabled}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">本月新增</p>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>

          {/* 预警级别分布 */}
          <div className="flex flex-wrap gap-4">
            {(['red', 'orange', 'yellow', 'blue'] as WarningLevel[]).map(level => {
              const config = levelConfig[level];
              const count = stats.byLevel[level];
              return (
                <div key={level} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: config.bg }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-sm font-medium" style={{ color: config.color }}>
                    {config.label} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 筛选和操作栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索规则名称、条件..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* 级别筛选 */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as WarningLevel | 'all')}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部级别</option>
              <option value="red">红色预警</option>
              <option value="orange">橙色预警</option>
              <option value="yellow">黄色预警</option>
              <option value="blue">蓝色预警</option>
            </select>

            {/* 状态筛选 */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'enabled' | 'disabled')}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="enabled">已启用</option>
              <option value="disabled">已禁用</option>
            </select>

            {/* 排序 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'createdAt' | 'updatedAt');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="updatedAt-desc">最近更新</option>
              <option value="updatedAt-asc">最早更新</option>
              <option value="createdAt-desc">最近创建</option>
              <option value="createdAt-asc">最早创建</option>
              <option value="name-asc">名称升序</option>
              <option value="name-desc">名称降序</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* 视图切换 */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 ${viewMode === 'card' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* 新建按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建规则
            </motion.button>
          </div>
        </div>

        {/* 批量操作栏 */}
        <AnimatePresence>
          {showBatchActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  已选择 <span className="font-medium text-slate-800">{selectedRules.size}</span> 条规则
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBatchEnable}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    批量启用
                  </button>
                  <button
                    onClick={handleBatchDisable}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    批量禁用
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    批量删除
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRules(new Set());
                      setShowBatchActions(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 规则列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="divide-y divide-slate-100">
            {/* 表头 */}
            <div className="px-6 py-3 bg-slate-50 flex items-center gap-4">
              <input
                type="checkbox"
                checked={filteredRules.length > 0 && selectedRules.size === filteredRules.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex-1">规则信息</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-24">级别</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-24">状态</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider w-32">操作</span>
            </div>

            {/* 规则行 */}
            {filteredRules.map((rule, index) => {
              const config = levelConfig[rule.level];
              const LevelIcon = getLevelIcon(rule.level);
              const isSelected = selectedRules.has(rule.id);
              
              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectRule(rule.id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleViewDetail(rule.id)}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-slate-800">{rule.name}</span>
                      <span className="text-xs text-slate-400">{rule.category}</span>
                      <span className="text-xs text-slate-400">{rule.frequency}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{rule.condition}</p>
                  </div>

                  <div className="w-24">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: config.bg,
                        color: config.color
                      }}
                    >
                      <LevelIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="w-24">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        rule.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {rule.enabled ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      {rule.enabled ? '已启用' : '已禁用'}
                    </button>
                  </div>

                  <div className="w-32 flex items-center gap-1">
                    <button
                      onClick={() => handleViewDetail(rule.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(rule.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(rule.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="复制"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(rule.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 卡片视图 */
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRules.map((rule, index) => {
              const config = levelConfig[rule.level];
              const LevelIcon = getLevelIcon(rule.level);
              
              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRules.has(rule.id)}
                        onChange={() => handleSelectRule(rule.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        <LevelIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`p-1.5 rounded transition-colors ${
                        rule.enabled
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {rule.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="font-medium text-slate-800 mb-1 cursor-pointer" onClick={() => handleViewDetail(rule.id)}>
                    {rule.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{rule.condition}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>{rule.category}</span>
                    <span>{rule.frequency}</span>
                  </div>

                  <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleViewDetail(rule.id)}
                      className="flex-1 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleEdit(rule.id)}
                      className="flex-1 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDuplicate(rule.id)}
                      className="flex-1 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      复制
                    </button>
                    <button
                      onClick={() => handleDeleteClick(rule.id)}
                      className="flex-1 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 空状态 */}
        {filteredRules.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-2">未找到匹配的规则</p>
            <p className="text-sm text-slate-400">请调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>

      {/* 规则详情抽屉 */}
      <RuleDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        ruleId={selectedRuleId}
        onEdit={(id) => {
          setDetailDrawerOpen(false);
          handleEdit(id);
        }}
      />

      {/* 规则表单弹窗 */}
      <RuleFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        ruleId={selectedRuleId}
        isEditing={isEditing}
      />

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">确认删除</h3>
                  <p className="text-sm text-slate-500">此操作无法撤销</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                确定要删除这条预警规则吗？删除后将无法恢复。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
