import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, FileText, AlertTriangle, Shield, Save, AlertCircle, Plus, Trash2, Database, ChevronRight } from 'lucide-react';
import { RuleGroupType } from 'react-querybuilder';
import { 
  useWarningStore, 
  WarningLevel, 
  levelConfig, 
  categoryConfig, 
  frequencyOptions,
  predefinedFacts,
  getFieldsByFactId
} from '../store/warningStore';

interface RuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleId: string | null;
  isEditing: boolean;
}

interface FormData {
  name: string;
  category: string;
  level: WarningLevel;
  frequency: string;
  factId: string;
  query: RuleGroupType;
  condition: string;
  action: string;
  policyBasis: string;
  policyClause: string;
  description: string;
}

interface FormErrors {
  [key: string]: string;
}

// 规则类型：简单规则或规则组
type RuleType = 'rule' | 'group';

interface RuleItem {
  id: string;
  type: RuleType;
  field?: string;
  operator?: string;
  value?: string;
  valueType?: 'input' | 'field';
  combinator?: 'and' | 'or';
  rules?: RuleItem[];
}

const defaultQuery: RuleGroupType = {
  combinator: 'and',
  rules: []
};

const initialFormData: FormData = {
  name: '',
  category: '财务风险',
  level: 'orange',
  frequency: '月度触发',
  factId: 'financial_indicator',
  query: defaultQuery,
  condition: '',
  action: '',
  policyBasis: '',
  policyClause: '',
  description: ''
};

// 生成唯一ID
const generateId = () => `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 操作符映射
const operatorMap: Record<string, string> = {
  '=': '等于',
  '!=': '不等于',
  '>': '大于',
  '>=': '大于等于',
  '<': '小于',
  '<=': '小于等于',
  'contains': '包含',
};

// 组合器映射
const combinatorMap: Record<string, string> = {
  'and': '且',
  'or': '或',
};

// 自定义查询转自然语言
const formatQueryToNatural = (query: RuleGroupType, fields: any[]): string => {
  const getFieldLabel = (name: string) => {
    const field = fields.find(f => f.name === name);
    return field?.label || name;
  };

  const formatRule = (rule: any): string => {
    if (rule.rules) {
      // 是规则组
      const subRules = rule.rules.map(formatRule).filter(Boolean);
      if (subRules.length === 0) return '';
      if (subRules.length === 1) return subRules[0];
      return `(${subRules.join(` ${combinatorMap[rule.combinator] || rule.combinator} `)})`;
    }
    
    // 是普通规则
    if (!rule.field || !rule.operator) return '';
    
    const fieldLabel = getFieldLabel(rule.field);
    const operatorLabel = operatorMap[rule.operator] || rule.operator;
    
    let valueLabel = rule.value || '';
    if (rule.valueType === 'field' || (typeof rule.value === 'string' && rule.value.startsWith('field:'))) {
      const fieldName = rule.value.replace('field:', '');
      valueLabel = getFieldLabel(fieldName);
    }
    
    return `${fieldLabel} ${operatorLabel} ${valueLabel}`;
  };

  if (!query.rules || query.rules.length === 0) {
    return '暂无条件';
  }

  const rules = query.rules.map(formatRule).filter(Boolean);
  if (rules.length === 0) return '暂无条件';
  if (rules.length === 1) return rules[0];
  
  return rules.join(` ${combinatorMap[query.combinator] || query.combinator} `);
};

export default function RuleFormModal({ isOpen, onClose, ruleId, isEditing }: RuleFormModalProps) {
  const { rules, addRule, updateRule } = useWarningStore();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'condition' | 'policy'>('basic');
  const [fields, setFields] = useState<any[]>([]);

  // 加载规则数据（编辑模式）
  useEffect(() => {
    if (isEditing && ruleId) {
      const rule = rules.find(r => r.id === ruleId);
      if (rule) {
        setFormData({
          name: rule.name,
          category: rule.category,
          level: rule.level,
          frequency: rule.frequency,
          factId: rule.factId,
          query: rule.query || defaultQuery,
          condition: rule.condition,
          action: rule.action,
          policyBasis: rule.policyBasis || '',
          policyClause: rule.policyClause || '',
          description: rule.description || ''
        });
        setFields(getFieldsByFactId(rule.factId));
      }
    } else {
      setFormData(initialFormData);
      setFields(getFieldsByFactId('financial_indicator'));
    }
    setErrors({});
    setActiveTab('basic');
  }, [isEditing, ruleId, rules, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入规则名称';
    } else if (formData.name.length < 2) {
      newErrors.name = '规则名称至少2个字符';
    } else if (formData.name.length > 50) {
      newErrors.name = '规则名称最多50个字符';
    }

    if (!formData.category) {
      newErrors.category = '请选择所属分类';
    }

    if (!formData.factId) {
      newErrors.factId = '请选择事实对象';
    }

    if (!formData.query.rules || formData.query.rules.length === 0) {
      newErrors.query = '请至少添加一个条件';
    }

    if (!formData.action.trim()) {
      newErrors.action = '请输入处置要求';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      if (errors.name || errors.category || errors.factId) {
        setActiveTab('basic');
      } else if (errors.query || errors.action) {
        setActiveTab('condition');
      }
      return;
    }

    // 自动生成条件描述
    const conditionDesc = formatQueryToNatural(formData.query, fields);

    const ruleData = {
      ...formData,
      condition: conditionDesc,
      enabled: true
    };

    if (isEditing && ruleId) {
      updateRule(ruleId, ruleData);
    } else {
      addRule(ruleData);
    }

    onClose();
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFactChange = (factId: string) => {
    handleChange('factId', factId);
    setFields(getFieldsByFactId(factId));
    // 重置查询条件
    handleChange('query', defaultQuery);
  };

  const getLevelIcon = (level: WarningLevel) => {
    switch (levelConfig[level].icon) {
      case 'AlertOctagon': return AlertCircle;
      case 'AlertTriangle': return AlertTriangle;
      case 'AlertCircle': return AlertCircle;
      case 'Info': return FileText;
      default: return AlertCircle;
    }
  };

  // 递归渲染规则组
  const RuleGroup = ({ 
    query, 
    onChange, 
    depth = 0 
  }: { 
    query: RuleGroupType; 
    onChange: (q: RuleGroupType) => void;
    depth?: number;
  }) => {
    const addRule = () => {
      const newRule = {
        field: fields[0]?.name || '',
        operator: '>',
        value: '',
        valueType: 'input'
      };
      onChange({
        ...query,
        rules: [...(query.rules || []), newRule]
      });
    };

    const addGroup = () => {
      onChange({
        ...query,
        rules: [...(query.rules || []), {
          combinator: 'and',
          rules: []
        }]
      });
    };

    const removeRule = (index: number) => {
      const newRules = [...(query.rules || [])];
      newRules.splice(index, 1);
      onChange({
        ...query,
        rules: newRules
      });
    };

    const updateRule = (index: number, updates: any) => {
      const newRules = [...(query.rules || [])];
      newRules[index] = { ...newRules[index], ...updates };
      onChange({
        ...query,
        rules: newRules
      });
    };

    const updateSubGroup = (index: number, subQuery: RuleGroupType) => {
      const newRules = [...(query.rules || [])];
      newRules[index] = subQuery;
      onChange({
        ...query,
        rules: newRules
      });
    };

    return (
      <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-200' : ''}`}>
        {/* 组合器选择 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-slate-500">{depth === 0 ? '当' : ''}</span>
          <select
            value={query.combinator}
            onChange={(e) => onChange({ ...query, combinator: e.target.value })}
            className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="and">满足所有</option>
            <option value="or">满足任一</option>
          </select>
          <span className="text-sm text-slate-500">以下条件</span>
        </div>

        {/* 规则列表 */}
        <div className="space-y-2">
          {(query.rules || []).map((rule: any, index: number) => {
            // 如果是子规则组
            if (rule.rules) {
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">条件组</span>
                    <button
                      onClick={() => removeRule(index)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <RuleGroup 
                    query={rule} 
                    onChange={(sq) => updateSubGroup(index, sq)}
                    depth={depth + 1}
                  />
                </div>
              );
            }

            // 普通规则
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-2 flex-wrap">
                {/* 字段选择 */}
                <select
                  value={rule.field || ''}
                  onChange={(e) => updateRule(index, { field: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px]"
                >
                  <option value="">选择字段...</option>
                  {fields.map((field: any) => (
                    <option key={field.name} value={field.name}>
                      {field.label}
                    </option>
                  ))}
                </select>

                {/* 操作符选择 */}
                <select
                  value={rule.operator || '='}
                  onChange={(e) => updateRule(index, { operator: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="=">等于</option>
                  <option value="!=">不等于</option>
                  <option value=">">大于</option>
                  <option value=">=">大于等于</option>
                  <option value="<">小于</option>
                  <option value="<=">小于等于</option>
                </select>

                {/* 值类型和值 */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <select
                    value={rule.valueType || 'input'}
                    onChange={(e) => {
                      const valueType = e.target.value;
                      updateRule(index, { 
                        valueType,
                        value: valueType === 'field' ? (fields[0]?.name || '') : ''
                      });
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-[90px]"
                  >
                    <option value="input">输入值</option>
                    <option value="field">字段</option>
                  </select>

                  {rule.valueType === 'field' ? (
                    <select
                      value={rule.value || ''}
                      onChange={(e) => updateRule(index, { value: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[100px]"
                    >
                      {fields.map((field: any) => (
                        <option key={field.name} value={field.name}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={rule.value || ''}
                      onChange={(e) => updateRule(index, { value: e.target.value })}
                      placeholder="输入值..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[100px]"
                    />
                  )}
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => removeRule(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除条件"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 添加按钮 */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={addRule}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            添加条件
          </button>
          <button
            onClick={addGroup}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            添加条件组
          </button>
        </div>
      </div>
    );
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {isEditing ? '编辑预警规则' : '新建预警规则'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEditing ? '修改现有预警规则配置' : '配置新的AI预警规则'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 标签页导航 */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-slate-200 bg-white">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                基本信息
                {(errors.name || errors.category || errors.factId) && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('condition')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'condition'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Code className="w-4 h-4" />
                触发条件
                {(errors.query || errors.action) && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'policy'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                制度依据
              </button>
            </div>

            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* 基本信息标签页 */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        规则名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="请输入规则名称，如：资产负债率异常预警"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          所属分类 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            errors.category ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                          }`}
                        >
                          {Object.keys(categoryConfig).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          触发频率 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => handleChange('frequency', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                          {frequencyOptions.map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        数据来源（事实对象） <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.factId}
                        onChange={(e) => handleFactChange(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.factId ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      >
                        {predefinedFacts.map(fact => (
                          <option key={fact.id} value={fact.id}>
                            {fact.name} ({fact.source})
                          </option>
                        ))}
                      </select>
                      {errors.factId && (
                        <p className="mt-1 text-sm text-red-600">{errors.factId}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        选择数据来源后，可在"触发条件"标签页配置具体规则
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        预警级别 <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['red', 'orange', 'yellow', 'blue'] as WarningLevel[]).map(level => {
                          const config = levelConfig[level];
                          const LevelIcon = getLevelIcon(level);
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleChange('level', level)}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                formData.level === level
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: config.bg }}
                              >
                                <LevelIcon className="w-4 h-4" style={{ color: config.color }} />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-slate-800">{config.label}</p>
                                <p className="text-xs text-slate-500">{config.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 触发条件标签页 */}
                {activeTab === 'condition' && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-slate-700">
                          触发条件 <span className="text-red-500">*</span>
                        </label>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          <Database className="w-3.5 h-3.5" />
                          {predefinedFacts.find(f => f.id === formData.factId)?.name}
                        </span>
                      </div>
                      
                      <div className={`bg-slate-50 rounded-xl p-4 ${errors.query ? 'ring-2 ring-red-300' : ''}`}>
                        <RuleGroup 
                          query={formData.query}
                          onChange={(query) => handleChange('query', query)}
                        />
                      </div>
                      {errors.query && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.query}
                        </p>
                      )}
                    </div>

                    {formData.query.rules && formData.query.rules.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          条件预览
                        </h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                          {formatQueryToNatural(formData.query, fields)}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        处置要求 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.action}
                        onChange={(e) => handleChange('action', e.target.value)}
                        placeholder="请输入触发后的处置要求"
                        rows={3}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
                          errors.action ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.action && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.action}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 制度依据标签页 */}
                {activeTab === 'policy' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        制度依据
                      </label>
                      <input
                        type="text"
                        value={formData.policyBasis}
                        onChange={(e) => handleChange('policyBasis', e.target.value)}
                        placeholder="如：《市属国有企业绩效考评办法》"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        具体条款
                      </label>
                      <input
                        type="text"
                        value={formData.policyClause}
                        onChange={(e) => handleChange('policyClause', e.target.value)}
                        placeholder="如：第三章第十二条"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        规则说明
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="请输入规则的详细说明（可选）"
                        rows={4}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-500">
                <span className="text-red-500">*</span> 为必填项
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? '保存修改' : '创建规则'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
