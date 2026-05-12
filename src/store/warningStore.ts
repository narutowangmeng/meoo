import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RuleGroupType, Field } from 'react-querybuilder';

export type WarningLevel = 'red' | 'orange' | 'yellow' | 'blue';

// 事实对象字段定义
export interface FactField {
  name: string;
  label: string;
  inputType?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  operators?: string[];
  valueEditorType?: 'text' | 'number' | 'select' | 'date' | 'checkbox';
  values?: { name: string; label: string }[];
  unit?: string;
}

// 事实对象定义
export interface FactDefinition {
  id: string;
  name: string;
  source: string;
  fields: FactField[];
}

// 预警规则 - 使用 react-querybuilder 的查询结构
export interface WarningRule {
  id: string;
  category: string;
  name: string;
  // 使用 react-querybuilder 的规则组结构
  query: RuleGroupType;
  // 原始条件描述（用于显示）
  condition: string;
  level: WarningLevel;
  frequency: string;
  action: string;
  source: string;
  // 关联的事实对象ID
  factId: string;
  policyBasis: string;
  policyClause: string;
  description?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface WarningRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  category: string;
  level: WarningLevel;
  triggerTime: string;
  status: 'pending' | 'processing' | 'resolved';
  description: string;
}

// 规则分类配置
export const categoryConfig: Record<string, { color: string; icon: string; count: number }> = {
  '财务风险': { color: '#ef4444', icon: 'TrendingDown', count: 22 },
  '三重一大': { color: '#a855f7', icon: 'FileText', count: 3 },
  '招聘人事': { color: '#22c55e', icon: 'Users', count: 6 },
  '投资项目': { color: '#6366f1', icon: 'Briefcase', count: 8 },
  '招标采购': { color: '#f59e0b', icon: 'ShoppingCart', count: 8 },
  '资产管理': { color: '#14b8a6', icon: 'Building2', count: 7 },
  '资金司库': { color: '#f43f5e', icon: 'Wallet', count: 7 },
  '党建廉洁': { color: '#dc2626', icon: 'Flag', count: 8 },
  '综合监管': { color: '#64748b', icon: 'BarChart3', count: 8 }
};

// 预警级别配置
export const levelConfig: Record<WarningLevel, { 
  color: string; 
  bg: string; 
  border: string;
  text: string;
  bgClass: string;
  borderClass: string;
  label: string;
  description: string;
  action: string;
  icon: string;
}> = {
  red: { 
    color: '#dc2626', 
    bg: '#fef2f2', 
    border: '#fecaca',
    text: 'text-red-600',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    label: '红色预警',
    description: '违规、违法、重大风险已现实化',
    action: '立即上报，立即处置，启动追责',
    icon: 'AlertOctagon'
  },
  orange: { 
    color: '#ea580c', 
    bg: '#fff7ed', 
    border: '#fed7aa',
    text: 'text-orange-600',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    label: '橙色预警',
    description: '监管指标超警戒值，风险较高',
    action: '约谈主要负责人，要求限期整改',
    icon: 'AlertTriangle'
  },
  yellow: { 
    color: '#ca8a04', 
    bg: '#fefce8', 
    border: '#fde047',
    text: 'text-yellow-600',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-200',
    label: '黄色预警',
    description: '指标偏离正常区间，存在隐患',
    action: '系统通知，纳入考核，要求说明',
    icon: 'AlertCircle'
  },
  blue: { 
    color: '#2563eb', 
    bg: '#eff6ff', 
    border: '#bfdbfe',
    text: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    label: '蓝色预警',
    description: '系统数据异常，需人工核查',
    action: '系统提示，锁定数据待审核',
    icon: 'Info'
  }
};

// 触发频率选项
export const frequencyOptions = [
  '实时监测',
  '发现即触发',
  '按项目触发',
  '每日',
  '每周',
  '月度触发',
  '月度统计',
  '季度统计',
  '季度盘点',
  '年度统计',
  '滚动监测'
];

// 预定义的事实对象和字段 - 用于 react-querybuilder
export const predefinedFacts: FactDefinition[] = [
  {
    id: 'financial_indicator',
    name: '财务指标',
    source: '财务系统',
    fields: [
      { name: 'debtRatio', label: '资产负债率', inputType: 'number', unit: '%' },
      { name: 'currentRatio', label: '流动比率', inputType: 'number' },
      { name: 'quickRatio', label: '速动比率', inputType: 'number' },
      { name: 'netProfit', label: '净利润', inputType: 'number', unit: '万元' },
      { name: 'revenue', label: '营业收入', inputType: 'number', unit: '万元' },
      { name: 'totalDebt', label: '负债总额', inputType: 'number', unit: '万元' },
      { name: 'totalAssets', label: '资产总额', inputType: 'number', unit: '万元' },
      { name: 'costGrowth', label: '成本增长率', inputType: 'number', unit: '%' },
      { name: 'revenueGrowth', label: '收入增长率', inputType: 'number', unit: '%' },
      { name: 'cashFlow', label: '经营性现金流', inputType: 'number', unit: '万元' },
    ]
  },
  {
    id: 'investment_project',
    name: '投资项目',
    source: '投资系统',
    fields: [
      { name: 'projectId', label: '项目ID', inputType: 'text' },
      { name: 'investmentAmount', label: '投资金额', inputType: 'number', unit: '万元' },
      { name: 'budgetAmount', label: '预算金额', inputType: 'number', unit: '万元' },
      { name: 'progress', label: '项目进度', inputType: 'number', unit: '%' },
      { name: 'plannedEndDate', label: '计划完成日期', inputType: 'date' },
      { name: 'actualEndDate', label: '实际完成日期', inputType: 'date' },
    ]
  },
  {
    id: 'procurement_project',
    name: '招标项目',
    source: '招投标系统',
    fields: [
      { name: 'projectId', label: '项目ID', inputType: 'text' },
      { name: 'budget', label: '预算金额', inputType: 'number', unit: '万元' },
      { name: 'bidAmount', label: '中标金额', inputType: 'number', unit: '万元' },
      { name: 'bidderCount', label: '投标单位数', inputType: 'number' },
      { name: 'procurementMethod', label: '招标方式', inputType: 'select', values: [{ name: 'open', label: '公开招标' }, { name: 'invite', label: '邀请招标' }, { name: 'single', label: '单一来源' }] },
    ]
  },
  {
    id: 'personnel',
    name: '人事信息',
    source: '人事系统',
    fields: [
      { name: 'deptId', label: '部门ID', inputType: 'text' },
      { name: 'actualCount', label: '实有人数', inputType: 'number' },
      { name: 'authorizedCount', label: '编制人数', inputType: 'number' },
      { name: 'middleManagerCount', label: '中层人数', inputType: 'number' },
    ]
  },
  {
    id: 'payment',
    name: '资金支付',
    source: '资金系统',
    fields: [
      { name: 'paymentId', label: '支付ID', inputType: 'text' },
      { name: 'amount', label: '支付金额', inputType: 'number', unit: '万元' },
      { name: 'type', label: '支付类型', inputType: 'select', values: [{ name: 'normal', label: '正常支付' }, { name: 'urgent', label: '紧急支付' }] },
      { name: 'paymentTime', label: '支付时间', inputType: 'date' },
      { name: 'withinBudget', label: '是否预算内', inputType: 'boolean' },
    ]
  }
];

// 将事实对象字段转换为 react-querybuilder 的 Field 格式
export const getFieldsByFactId = (factId: string): Field[] => {
  const fact = predefinedFacts.find(f => f.id === factId);
  if (!fact) return [];
  
  return fact.fields.map(field => {
    const baseField: Field = {
      name: field.name,
      label: field.unit ? `${field.label} (${field.unit})` : field.label,
    };
    
    // 根据 inputType 设置 valueEditorType
    if (field.inputType === 'select' && field.values) {
      baseField.valueEditorType = 'select';
      baseField.values = field.values.map(v => ({ name: v.name, label: v.label }));
    } else if (field.inputType === 'boolean') {
      baseField.valueEditorType = 'checkbox';
    } else if (field.inputType === 'date') {
      baseField.valueEditorType = 'date';
    } else if (field.inputType === 'number') {
      baseField.inputType = 'number';
    }
    
    return baseField;
  });
};

// 完整的77条规则数据
const initialRules: WarningRule[] = [
  // 财务风险 - 22条
  {
    id: 'f1',
    category: '财务风险',
    name: '资产负债异常',
    condition: '资产增加额小于负债增加额',
    query: {
      combinator: 'and',
      rules: [
        { field: 'totalAssets', operator: '<', value: 'totalDebt' }
      ]
    },
    level: 'orange',
    frequency: '月度触发',
    action: '纳入年度考核扣分',
    source: '财务系统/资产总额、负债总额',
    factId: 'financial_indicator',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '市属国有企业绩效考评办法"三升一降"',
    description: '监测企业资产与负债增长情况，当资产增加额小于负债增加额时触发预警',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f2',
    category: '财务风险',
    name: '负债增长过快',
    condition: '负债同比增长 > 10%',
    query: {
      combinator: 'and',
      rules: [
        { field: 'totalDebt', operator: '>', value: '10' }
      ]
    },
    level: 'red',
    frequency: '月度触发',
    action: '启动追责程序',
    source: '财务系统/负债总额',
    factId: 'financial_indicator',
    policyBasis: '债务统计分析暨预警系统运行管理制度',
    policyClause: '连国资〔2022〕95号',
    description: '监测企业负债增长速度，当同比增长超过10%时触发红色预警',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f3',
    category: '财务风险',
    name: '成本费用异常',
    condition: '成本增幅高于收入增幅5个百分点',
    level: 'red',
    frequency: '月度触发',
    action: '要求整改并提交分析报告',
    source: '财务系统/成本、收入数据',
    logic: '成本增长率 - 收入增长率 > 5%',
    policyBasis: '全面预算管理工作规则',
    policyClause: '2025年10月28日',
    description: '监测成本费用控制情况，当成本增幅显著高于收入增幅时预警',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f4',
    category: '财务风险',
    name: '现金流下降',
    condition: '经营性现金流同比下降 > 10%',
    level: 'red',
    frequency: '月度触发',
    action: '重点监控并要求改善',
    source: '财务系统/现金流量表',
    logic: '(本期经营现金流 - 上期经营现金流) / 上期经营现金流 < -0.1',
    policyBasis: '大额资金动态监测系统运行管理工作办法',
    policyClause: '连国资〔2024〕73号',
    description: '监测企业经营活动现金流状况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f5',
    category: '财务风险',
    name: '利润下滑',
    condition: '净利润同比下滑 > 20%',
    level: 'orange',
    frequency: '月度触发',
    action: '提交改善方案',
    source: '财务系统/利润表',
    logic: '(本期净利润 - 上期净利润) / 上期净利润 < -0.2',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '绩效考核指标',
    description: '监测企业盈利能力变化',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f6',
    category: '财务风险',
    name: '资产负债率过高',
    condition: '资产负债率 > 80%',
    level: 'orange',
    frequency: '月度触发',
    action: '要求制定降负债方案',
    source: '财务系统/资产负债表',
    logic: '负债总额 / 资产总额 > 0.8',
    policyBasis: '债务统计分析暨预警系统运行管理制度',
    policyClause: '连国资〔2022〕95号',
    description: '监测企业整体债务风险水平',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f7',
    category: '财务风险',
    name: '流动比率不足',
    condition: '流动比率 < 1.2',
    level: 'yellow',
    frequency: '月度触发',
    action: '关注并定期报告',
    source: '财务系统/流动资产、流动负债',
    logic: '流动资产 / 流动负债 < 1.2',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '财务风险指标',
    description: '监测企业短期偿债能力',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f8',
    category: '财务风险',
    name: '速动比率不足',
    condition: '速动比率 < 0.8',
    level: 'yellow',
    frequency: '月度触发',
    action: '关注并定期报告',
    source: '财务系统/速动资产、流动负债',
    logic: '(流动资产 - 存货) / 流动负债 < 0.8',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '财务风险指标',
    description: '监测企业即时偿债能力',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f9',
    category: '财务风险',
    name: '应收账款周转异常',
    condition: '应收账款周转天数 > 180天',
    level: 'orange',
    frequency: '季度统计',
    action: '加强催收管理',
    source: '财务系统/应收账款、营业收入',
    logic: '365 / (营业收入 / 平均应收账款余额) > 180',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '资产质量指标',
    description: '监测企业应收账款回收效率',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f10',
    category: '财务风险',
    name: '存货周转异常',
    condition: '存货周转天数 > 120天',
    level: 'yellow',
    frequency: '季度统计',
    action: '优化库存管理',
    source: '财务系统/存货、营业成本',
    logic: '365 / (营业成本 / 平均存货余额) > 120',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '资产质量指标',
    description: '监测企业存货管理效率',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f11',
    category: '财务风险',
    name: '营业利润率下降',
    condition: '营业利润率同比下降 > 5个百分点',
    level: 'yellow',
    frequency: '月度触发',
    action: '分析原因并整改',
    source: '财务系统/营业利润、营业收入',
    logic: '本期营业利润率 - 上期营业利润率 < -0.05',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '盈利能力指标',
    description: '监测企业主营业务盈利能力',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f12',
    category: '财务风险',
    name: '净资产收益率下降',
    condition: 'ROE同比下降 > 3个百分点',
    level: 'yellow',
    frequency: '季度统计',
    action: '提升资本运营效率',
    source: '财务系统/净利润、净资产',
    logic: '本期ROE - 上期ROE < -0.03',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '盈利能力指标',
    description: '监测企业资本回报水平',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f13',
    category: '财务风险',
    name: '利息保障倍数不足',
    condition: '利息保障倍数 < 3',
    level: 'orange',
    frequency: '季度统计',
    action: '优化债务结构',
    source: '财务系统/息税前利润、利息费用',
    logic: '息税前利润 / 利息费用 < 3',
    policyBasis: '债务统计分析暨预警系统运行管理制度',
    policyClause: '偿债能力指标',
    description: '监测企业偿付利息能力',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f14',
    category: '财务风险',
    name: '资本积累率不足',
    condition: '资本积累率 < 5%',
    level: 'yellow',
    frequency: '年度统计',
    action: '增强资本积累能力',
    source: '财务系统/所有者权益',
    logic: '(期末所有者权益 - 期初所有者权益) / 期初所有者权益 < 0.05',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '发展能力指标',
    description: '监测企业资本积累能力',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f15',
    category: '财务风险',
    name: '营业收入增长率异常',
    condition: '营业收入增长率 < 行业平均水平',
    level: 'yellow',
    frequency: '季度统计',
    action: '分析市场竞争状况',
    source: '财务系统/营业收入',
    logic: '本期营业收入增长率 < 行业平均增长率',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '发展能力指标',
    description: '监测企业收入增长情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f16',
    category: '财务风险',
    name: '期间费用率过高',
    condition: '期间费用率 > 25%',
    level: 'yellow',
    frequency: '月度触发',
    action: '控制费用支出',
    source: '财务系统/期间费用、营业收入',
    logic: '期间费用 / 营业收入 > 0.25',
    policyBasis: '全面预算管理工作规则',
    policyClause: '成本控制指标',
    description: '监测企业费用控制水平',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f17',
    category: '财务风险',
    name: '资产减值损失异常',
    condition: '资产减值损失占利润比 > 20%',
    level: 'orange',
    frequency: '季度统计',
    action: '核查资产质量',
    source: '财务系统/资产减值损失、利润总额',
    logic: '资产减值损失 / 利润总额 > 0.2',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '资产质量指标',
    description: '监测企业资产减值风险',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f18',
    category: '财务风险',
    name: '对外担保余额过高',
    condition: '对外担保余额 > 净资产50%',
    level: 'red',
    frequency: '月度统计',
    action: '严格控制新增担保',
    source: '财务系统/对外担保、净资产',
    logic: '对外担保余额 / 净资产 > 0.5',
    policyBasis: '违规经营投资责任追究暂行办法',
    policyClause: '担保管理规定',
    description: '监测企业对外担保风险',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f19',
    category: '财务风险',
    name: '关联交易占比过高',
    condition: '关联交易收入占比 > 30%',
    level: 'orange',
    frequency: '年度统计',
    action: '规范关联交易管理',
    source: '财务系统/关联交易、营业收入',
    logic: '关联交易收入 / 营业收入 > 0.3',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '关联交易规定',
    description: '监测企业关联交易风险',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f20',
    category: '财务风险',
    name: '或有负债风险',
    condition: '或有负债金额 > 净资产20%',
    level: 'orange',
    frequency: '季度统计',
    action: '评估或有负债风险',
    source: '财务系统/或有负债、净资产',
    logic: '或有负债金额 / 净资产 > 0.2',
    policyBasis: '债务统计分析暨预警系统运行管理制度',
    policyClause: '连国资〔2022〕95号',
    description: '监测企业或有负债风险',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f21',
    category: '财务风险',
    name: '债务逾期风险',
    condition: '存在债务逾期情况',
    level: 'red',
    frequency: '发现即触发',
    action: '立即处置并上报',
    source: '债务管理系统/债务台账',
    logic: '存在到期未偿还债务',
    policyBasis: '债务统计分析暨预警系统运行管理制度',
    policyClause: '连国资〔2022〕95号',
    description: '监测企业债务违约风险',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'f22',
    category: '财务风险',
    name: '融资结构不合理',
    condition: '短期负债占比 > 70%',
    level: 'orange',
    frequency: '季度统计',
    action: '优化融资结构',
    source: '财务系统/短期负债、总负债',
    logic: '短期负债 / 总负债 > 0.7',
    policyBasis: '债务统计分析暨预警系统运行管理制度',
    policyClause: '连国资〔2022〕95号',
    description: '监测企业债务期限结构',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 三重一大 - 3条
  {
    id: 't1',
    category: '三重一大',
    name: '先执行后补程序',
    condition: '执行时间早于上会时间',
    level: 'red',
    frequency: '发现即触发',
    action: '立即停止并追责',
    source: '三重一大系统/决策记录',
    logic: '实际执行日期 < 决策会议日期',
    policyBasis: '"三重一大"决策制度',
    policyClause: '决策程序规定',
    description: '监测三重一大决策程序合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 't2',
    category: '三重一大',
    name: '前置研究未履行',
    condition: '重大决策未履行党委会前置研究程序',
    level: 'red',
    frequency: '发现即触发',
    action: '决策暂缓并补程序',
    source: '三重一大系统/会议记录',
    logic: '重大决策事项无党委会前置研究记录',
    policyBasis: '"三重一大"决策制度',
    policyClause: '党委前置研究规定',
    description: '监测党委前置研究程序执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 't3',
    category: '三重一大',
    name: '资金拆分规避',
    condition: '单笔应上会金额被人为分拆支付',
    level: 'red',
    frequency: '发现即触发',
    action: '启动追责程序',
    source: '支付系统/付款记录',
    logic: '同一事项分拆支付，合计金额达到上会标准',
    policyBasis: '"三重一大"决策制度',
    policyClause: '规避决策程序规定',
    description: '监测规避三重一大决策程序行为',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 招聘人事 - 6条
  {
    id: 'p1',
    category: '招聘人事',
    name: '用工超编',
    condition: '实有人数超管控数',
    level: 'orange',
    frequency: '季度统计',
    action: '提交说明并限期整改',
    source: '人事系统/人员编制',
    logic: '实际用工人数 > 核定编制人数',
    policyBasis: '关于加强2026年度市属监管企业招聘管理工作的通知',
    policyClause: '编制管理规定',
    description: '监测企业用工编制执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'p2',
    category: '招聘人事',
    name: '中层超配',
    condition: '中层实有人数超管控数',
    level: 'orange',
    frequency: '季度统计',
    action: '责令纠正',
    source: '人事系统/中层编制',
    logic: '中层干部实际人数 > 核定中层职数',
    policyBasis: '关于加强2026年度市属监管企业招聘管理工作的通知',
    policyClause: '中层职数管理规定',
    description: '监测企业中层干部配备情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'p3',
    category: '招聘人事',
    name: '招聘程序违规',
    condition: '未按程序公开招聘或违规录用',
    level: 'red',
    frequency: '发现即触发',
    action: '取消录用并追责',
    source: '人事系统/招聘记录',
    logic: '存在未经公开招聘程序录用人员',
    policyBasis: '关于加强2026年度市属监管企业招聘管理工作的通知',
    policyClause: '公开招聘规定',
    description: '监测招聘程序合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'p4',
    category: '招聘人事',
    name: '亲属回避不到位',
    condition: '存在应回避未回避情况',
    level: 'orange',
    frequency: '发现即触发',
    action: '调整岗位并说明',
    source: '人事系统/亲属关系申报',
    logic: '存在亲属关系未申报或未回避',
    policyBasis: '关于加强2026年度市属监管企业招聘管理工作的通知',
    policyClause: '回避制度规定',
    description: '监测亲属回避制度执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'p5',
    category: '招聘人事',
    name: '薪酬超标准',
    condition: '高管薪酬超核定标准',
    level: 'red',
    frequency: '年度统计',
    action: '退回超标部分并追责',
    source: '人事系统/薪酬数据',
    logic: '高管实际薪酬 > 核定薪酬标准',
    policyBasis: '市属国有企业负责人薪酬管理办法',
    policyClause: '薪酬管理规定',
    description: '监测企业负责人薪酬合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'p6',
    category: '招聘人事',
    name: '培训经费使用异常',
    condition: '培训经费使用不规范',
    level: 'yellow',
    frequency: '季度统计',
    action: '规范培训经费使用',
    source: '财务系统/培训经费',
    logic: '培训经费使用不符合规定',
    policyBasis: '市属国有企业培训管理办法',
    policyClause: '培训经费管理规定',
    description: '监测培训经费使用合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 投资项目 - 8条
  {
    id: 'i1',
    category: '投资项目',
    name: '超预算投资',
    condition: '实际投资超预算10%',
    level: 'red',
    frequency: '按项目触发',
    action: '暂停支付并上报',
    source: '投资系统/项目预算',
    logic: '(实际投资额 - 预算投资额) / 预算投资额 > 0.1',
    policyBasis: '市属监管企业投资监督管理办法',
    policyClause: '投资预算管理规定',
    description: '监测投资项目预算执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i2',
    category: '投资项目',
    name: '项目逾期',
    condition: '项目进度逾期超30天',
    level: 'orange',
    frequency: '按项目触发',
    action: '约谈整改',
    source: '项目系统/进度数据',
    logic: '实际进度日期 - 计划进度日期 > 30天',
    policyBasis: '全面预算管理工作规则',
    policyClause: '项目进度管理规定',
    description: '监测投资项目进度执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i3',
    category: '投资项目',
    name: '计划外投资',
    condition: '计划外投资占比 > 10%',
    level: 'orange',
    frequency: '月度统计',
    action: '要求提交说明并补审批程序',
    source: '投资系统/投资计划',
    logic: '计划外投资额 / 总投资额 > 0.1',
    policyBasis: '市属监管企业投资监督管理办法',
    policyClause: '投资计划管理规定',
    description: '监测投资计划执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i4',
    category: '投资项目',
    name: '项目超概算',
    condition: '项目超概算率 > 10%',
    level: 'orange',
    frequency: '按项目触发',
    action: '启动重大变更审批程序',
    source: '投资系统/概算数据',
    logic: '(实际投资额 - 概算投资额) / 概算投资额 > 0.1',
    policyBasis: '"三重一大"决策制度',
    policyClause: '概算调整规定',
    description: '监测项目概算执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i5',
    category: '投资项目',
    name: '投资收益不达标',
    condition: '实际收益率低于预期30%',
    level: 'yellow',
    frequency: '年度统计',
    action: '分析原因并改进',
    source: '投资系统/收益数据',
    logic: '(实际收益率 - 预期收益率) / 预期收益率 < -0.3',
    policyBasis: '市属监管企业投资监督管理办法',
    policyClause: '投资收益管理规定',
    description: '监测投资项目收益情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i6',
    category: '投资项目',
    name: '非主业投资占比过高',
    condition: '非主业投资占比 > 30%',
    level: 'orange',
    frequency: '年度统计',
    action: '调整投资结构',
    source: '投资系统/投资分类',
    logic: '非主业投资额 / 总投资额 > 0.3',
    policyBasis: '主责主业管理办法',
    policyClause: '主业管理规定',
    description: '监测投资方向合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i7',
    category: '投资项目',
    name: '投资决策程序违规',
    condition: '投资项目未履行决策程序',
    level: 'red',
    frequency: '发现即触发',
    action: '停止投资并追责',
    source: '投资系统/决策记录',
    logic: '投资项目无决策会议记录',
    policyBasis: '市属监管企业投资监督管理办法',
    policyClause: '投资决策程序规定',
    description: '监测投资决策程序合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'i8',
    category: '投资项目',
    name: '项目后评价未开展',
    condition: '应开展后评价项目未按时完成',
    level: 'yellow',
    frequency: '年度统计',
    action: '限期完成后评价',
    source: '投资系统/项目清单',
    logic: '应评价项目超过规定时间未评价',
    policyBasis: '市属监管企业投资监督管理办法',
    policyClause: '项目后评价规定',
    description: '监测投资项目后评价执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 招标采购 - 8条
  {
    id: 'b1',
    category: '招标采购',
    name: '应招未招',
    condition: '应招标项目未履行招标程序',
    level: 'red',
    frequency: '发现即触发',
    action: '立即叫停并追责',
    source: '招投标系统/项目清单',
    logic: '达到招标标准但未进行招标',
    policyBasis: '关于加强市属监管企业招标采购领域监督管理的实施意见',
    policyClause: '招标范围规定',
    description: '监测招标程序合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b2',
    category: '招标采购',
    name: '串标嫌疑',
    condition: '报价相似度 > 80%',
    level: 'orange',
    frequency: '按项目触发',
    action: '暂停开标并核查',
    source: '招投标系统/投标数据',
    logic: '不同投标人报价相似度 > 80%',
    policyBasis: '招标投标法实施条例',
    policyClause: '第40条',
    description: '监测串标围标行为',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b3',
    category: '招标采购',
    name: '领导干部插手干预',
    condition: '领导干部违规插手干预招投标',
    level: 'red',
    frequency: '发现即触发',
    action: '登记报告并调查',
    source: '招投标系统/干预记录',
    logic: '存在领导干部违规干预记录',
    policyBasis: '市国资委关于领导干部插手干预市属监管企业招标投标工作登记制度',
    policyClause: '2026年2月4日',
    description: '监测领导干部违规干预招投标',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b4',
    category: '招标采购',
    name: '采购价格异常',
    condition: '采购价高于市场基准价10%或低于20%',
    level: 'yellow',
    frequency: '按项目触发',
    action: '要求提交价格依据',
    source: '招投标系统/采购价格',
    logic: '采购价 > 市场基准价 * 1.1 或 采购价 < 市场基准价 * 0.8',
    policyBasis: '协同高效内部监督体系指导意见',
    policyClause: '采购价格监督规定',
    description: '监测采购价格合理性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b5',
    category: '招标采购',
    name: '供应商履约不合格',
    condition: '供应商履约评价合格率 < 80%',
    level: 'yellow',
    frequency: '季度统计',
    action: '触发供应商不良记录',
    source: '招投标系统/履约评价',
    logic: '合格履约次数 / 总履约次数 < 0.8',
    policyBasis: '关于加强市属监管企业招标采购领域监督管理的实施意见',
    policyClause: '供应商管理规定',
    description: '监测供应商履约情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b6',
    category: '招标采购',
    name: '投标异常行为',
    condition: '投标文件高度雷同、IP/机器码重合',
    level: 'orange',
    frequency: '按项目触发',
    action: '暂停开评标并核查',
    source: '招投标系统/技术数据',
    logic: '投标文件相似度高或技术标识重合',
    policyBasis: '招标投标法实施条例',
    policyClause: '第40条',
    description: '监测围标串标技术特征',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b7',
    category: '招标采购',
    name: '结算付款违规',
    condition: '未验收即付款或超比例预付款',
    level: 'orange',
    frequency: '按项目触发',
    action: '暂停付款并核查',
    source: '财务系统/付款记录',
    logic: '付款时未验收或预付款比例超标',
    policyBasis: '企业内部控制基本规范',
    policyClause: '第31条',
    description: '监测采购付款合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'b8',
    category: '招标采购',
    name: '单一来源采购异常',
    condition: '单一来源采购理由不充分',
    level: 'yellow',
    frequency: '发现即触发',
    action: '要求补充说明',
    source: '招投标系统/采购方式',
    logic: '单一来源采购论证不充分',
    policyBasis: '关于加强市属监管企业招标采购领域监督管理的实施意见',
    policyClause: '采购方式规定',
    description: '监测单一来源采购合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 资产管理 - 7条
  {
    id: 'a1',
    category: '资产管理',
    name: '账实不符',
    condition: '账实一致率差异 > 5%',
    level: 'orange',
    frequency: '季度盘点',
    action: '限期核查并说明',
    source: '资产系统/盘点数据',
    logic: '(账面资产 - 实有资产) / 账面资产 > 0.05',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '2026年3月27日',
    description: '监测资产账实一致性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'a2',
    category: '资产管理',
    name: '闲置资产超比例',
    condition: '闲置资产占比 > 10%',
    level: 'yellow',
    frequency: '月度统计',
    action: '制定盘活方案',
    source: '资产系统/资产台账',
    logic: '闲置资产金额 / 总资产金额 > 0.1',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '闲置资产管理规定',
    description: '监测资产闲置情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'a3',
    category: '资产管理',
    name: '权证缺失',
    condition: '存在资产权证缺失情况',
    level: 'orange',
    frequency: '发现即触发',
    action: '限期补办',
    source: '资产系统/权证台账',
    logic: '核心资产存在权证缺失',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '权证管理规定',
    description: '监测资产权证完整性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'a4',
    category: '资产管理',
    name: '租金欠缴',
    condition: '资产租金欠缴金额 > 30万元',
    level: 'orange',
    frequency: '月度统计',
    action: '系统催缴并法律追偿',
    source: '资产系统/租金台账',
    logic: '累计欠缴租金 > 30万元',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '租金管理规定',
    description: '监测资产租金收缴情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'a5',
    category: '资产管理',
    name: '抵押到期',
    condition: '抵押资产距到期日 ≤ 30天且未续期',
    level: 'orange',
    frequency: '滚动监测',
    action: '提前通知并限期处理',
    source: '资产系统/抵押台账',
    logic: '抵押到期日 - 当前日期 <= 30天且未续期',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '抵押管理规定',
    description: '监测资产抵押到期情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'a6',
    category: '资产管理',
    name: '抵押担保违规',
    condition: '资产抵押担保不符合规定',
    level: 'red',
    frequency: '发现即触发',
    action: '立即叫停并追责',
    source: '资产系统/担保台账',
    logic: '抵押担保未履行审批程序或对象不合规',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '担保管理规定',
    description: '监测抵押担保合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'a7',
    category: '资产管理',
    name: '资产成新率过低',
    condition: '固定资产成新率 < 30%',
    level: 'yellow',
    frequency: '年度统计',
    action: '提交更新改造计划',
    source: '资产系统/固定资产',
    logic: '固定资产净值 / 固定资产原值 < 0.3',
    policyBasis: '市属监管企业资产管理工作暂行办法',
    policyClause: '资产管理规定',
    description: '监测固定资产新旧程度',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 资金司库 - 7条
  {
    id: 'm1',
    category: '资金司库',
    name: '大额资金支出',
    condition: '对公支付超过100万',
    level: 'red',
    frequency: '实时监测',
    action: '系统预警并复核',
    source: '司库系统/支付数据',
    logic: '单笔支付金额 > 100万元',
    policyBasis: '大额资金动态监测系统运行管理工作办法',
    policyClause: '连国资〔2024〕73号',
    description: '监测大额资金支付',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'm2',
    category: '资金司库',
    name: '超预算支付',
    condition: '单笔支付超预算余额',
    level: 'red',
    frequency: '实时触发',
    action: '暂停支付',
    source: '司库系统/预算数据',
    logic: '累计支付金额 > 预算金额',
    policyBasis: '全面预算管理工作规则',
    policyClause: '预算控制规定',
    description: '监测预算执行控制',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'm3',
    category: '资金司库',
    name: '资金归集异常',
    condition: '资金归集率 < 90%',
    level: 'orange',
    frequency: '月度统计',
    action: '提高资金归集率',
    source: '司库系统/资金归集',
    logic: '归集资金 / 可归集资金 < 0.9',
    policyBasis: '大额资金动态监测系统运行管理工作办法',
    policyClause: '连国资〔2024〕73号',
    description: '监测资金归集情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'm4',
    category: '资金司库',
    name: '银行账户异常',
    condition: '存在未经审批的银行账户',
    level: 'red',
    frequency: '发现即触发',
    action: '清理违规账户',
    source: '司库系统/账户清单',
    logic: '银行账户无审批记录',
    policyBasis: '大额资金动态监测系统运行管理工作办法',
    policyClause: '账户管理规定',
    description: '监测银行账户合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'm5',
    category: '资金司库',
    name: '资金余额异常',
    condition: '日均资金余额低于安全线',
    level: 'yellow',
    frequency: '每日监测',
    action: '关注资金状况',
    source: '司库系统/资金余额',
    logic: '日均资金余额 < 安全线',
    policyBasis: '大额资金动态监测系统运行管理工作办法',
    policyClause: '资金安全管理规定',
    description: '监测资金流动性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'm6',
    category: '资金司库',
    name: '对外借款违规',
    condition: '对外借款未履行审批程序',
    level: 'red',
    frequency: '发现即触发',
    action: '停止借款并追责',
    source: '司库系统/借款记录',
    logic: '对外借款无审批记录',
    policyBasis: '违规经营投资责任追究暂行办法',
    policyClause: '借款管理规定',
    description: '监测对外借款合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'm7',
    category: '资金司库',
    name: '资金集中管理不到位',
    condition: '资金集中度 < 80%',
    level: 'orange',
    frequency: '月度统计',
    action: '加强资金集中管理',
    source: '司库系统/资金集中',
    logic: '集中管理资金 / 总资金 < 0.8',
    policyBasis: '大额资金动态监测系统运行管理工作办法',
    policyClause: '连国资〔2024〕73号',
    description: '监测资金集中管理情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 党建廉洁 - 8条
  {
    id: 'd1',
    category: '党建廉洁',
    name: '违规兼职',
    condition: '领导人员违规兼职取酬',
    level: 'red',
    frequency: '发现即触发',
    action: '党纪处理并退缴所得',
    source: '干部系统/兼职申报',
    logic: '存在未经批准的兼职或违规取酬',
    policyBasis: '国有企业领导人员廉洁从业若干规定',
    policyClause: '兼职管理规定',
    description: '监测领导人员兼职合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd2',
    category: '党建廉洁',
    name: '八项规定违反',
    condition: '超标公务接待/用车',
    level: 'orange',
    frequency: '发现即触发',
    action: '责令整改并通报',
    source: '财务系统/三公经费',
    logic: '公务支出超标准',
    policyBasis: '中央八项规定精神',
    policyClause: '厉行节约规定',
    description: '监测中央八项规定执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd3',
    category: '党建廉洁',
    name: '信访举报',
    condition: '收到信访举报线索',
    level: 'yellow',
    frequency: '发现即触发',
    action: '按程序核查处理',
    source: '纪检监察系统/信访记录',
    logic: '存在信访举报记录',
    policyBasis: '信访举报工作规定',
    policyClause: '信访处理规定',
    description: '监测信访举报情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd4',
    category: '党建廉洁',
    name: '三重一大决策违规',
    condition: '重大事项决策程序违规',
    level: 'red',
    frequency: '发现即触发',
    action: '追责并整改',
    source: '三重一大系统/决策记录',
    logic: '重大事项决策程序不合规',
    policyBasis: '"三重一大"决策制度',
    policyClause: '决策程序规定',
    description: '监测重大事项决策合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd5',
    category: '党建廉洁',
    name: '选人用人违规',
    condition: '干部选拔任用程序违规',
    level: 'red',
    frequency: '发现即触发',
    action: '纠正并追责',
    source: '人事系统/干部任免',
    logic: '干部选拔任用程序不合规',
    policyBasis: '党政领导干部选拔任用工作条例',
    policyClause: '选拔任用规定',
    description: '监测选人用人合规性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd6',
    category: '党建廉洁',
    name: '党内政治生活不规范',
    condition: '民主生活会质量不高',
    level: 'yellow',
    frequency: '年度统计',
    action: '提高党内政治生活质量',
    source: '党建系统/会议记录',
    logic: '民主生活会走过场',
    policyBasis: '关于新形势下党内政治生活的若干准则',
    policyClause: '民主生活会规定',
    description: '监测党内政治生活质量',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd7',
    category: '党建廉洁',
    name: '党风廉政建设不到位',
    condition: '党风廉政建设责任制落实不到位',
    level: 'orange',
    frequency: '年度考核',
    action: '加强党风廉政建设',
    source: '纪检监察系统/考核数据',
    logic: '党风廉政建设考核不合格',
    policyBasis: '党风廉政建设责任制规定',
    policyClause: '责任制规定',
    description: '监测党风廉政建设情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'd8',
    category: '党建廉洁',
    name: '巡视整改不到位',
    condition: '巡视反馈问题整改不到位',
    level: 'orange',
    frequency: '发现即触发',
    action: '限期整改',
    source: '纪检监察系统/整改记录',
    logic: '巡视整改未按时完成或整改不到位',
    policyBasis: '中国共产党巡视工作条例',
    policyClause: '巡视整改规定',
    description: '监测巡视整改执行情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // 综合监管 - 8条
  {
    id: 'c1',
    category: '综合监管',
    name: '预警过多',
    condition: '未关闭预警 > 10条',
    level: 'orange',
    frequency: '月度统计',
    action: '专题研判',
    source: '预警系统/预警记录',
    logic: '未关闭预警数量 > 10',
    policyBasis: '市县国资监管一张网管理驾驶舱运行管理办法',
    policyClause: '预警管理规定',
    description: '监测预警积压情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c2',
    category: '综合监管',
    name: '瞒报漏报',
    condition: '存在瞒报重要事项',
    level: 'red',
    frequency: '发现即触发',
    action: '启动约谈并追责',
    source: '各业务系统/数据比对',
    logic: '应报未报或数据明显异常',
    policyBasis: '企业国有资产法',
    policyClause: '信息报告规定',
    description: '监测信息报告完整性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c3',
    category: '综合监管',
    name: '数据异常',
    condition: '系统数据异常波动',
    level: 'blue',
    frequency: '实时监测',
    action: '锁定数据待审核',
    source: '各业务系统/数据校验',
    logic: '数据变化幅度异常或逻辑错误',
    policyBasis: '市县国资监管一张网管理驾驶舱运行管理办法',
    policyClause: '数据质量管理规定',
    description: '监测系统数据质量',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c4',
    category: '综合监管',
    name: '报告延迟',
    condition: '未按规定时间报送报告',
    level: 'yellow',
    frequency: '发现即触发',
    action: '督促按时报送',
    source: '各业务系统/报送记录',
    logic: '报告报送时间超过规定期限',
    policyBasis: '市属国有企业信息报告制度',
    policyClause: '报告报送规定',
    description: '监测报告报送及时性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c5',
    category: '综合监管',
    name: '整改不到位',
    condition: '历史问题整改不到位',
    level: 'orange',
    frequency: '季度检查',
    action: '限期整改并跟踪',
    source: '各业务系统/整改记录',
    logic: '历史问题未整改或整改不到位',
    policyBasis: '市属国有企业监督管理暂行办法',
    policyClause: '问题整改规定',
    description: '监测问题整改情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c6',
    category: '综合监管',
    name: '系统登录异常',
    condition: '长时间未登录系统',
    level: 'blue',
    frequency: '月度统计',
    action: '提醒及时登录',
    source: '系统日志/登录记录',
    logic: '超过30天未登录系统',
    policyBasis: '市县国资监管一张网管理驾驶舱运行管理办法',
    policyClause: '系统使用规定',
    description: '监测系统使用情况',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c7',
    category: '综合监管',
    name: '重大事项报告延迟',
    condition: '重大事项未及时报告',
    level: 'red',
    frequency: '发现即触发',
    action: '立即报告并说明',
    source: '各业务系统/事项记录',
    logic: '重大事项发生后未及时报告',
    policyBasis: '企业国有资产法',
    policyClause: '重大事项报告规定',
    description: '监测重大事项报告及时性',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'c8',
    category: '综合监管',
    name: '监管指标异常',
    condition: '多项监管指标同时异常',
    level: 'orange',
    frequency: '月度分析',
    action: '综合分析并处置',
    source: '预警系统/指标分析',
    logic: '同时触发3项以上预警',
    policyBasis: '市县国资监管一张网管理驾驶舱运行管理办法',
    policyClause: '综合分析规定',
    description: '监测多维度风险聚集',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  }
];

const initialRecords: WarningRecord[] = [
  { id: 'w1', ruleId: 'f2', ruleName: '负债增长过快', category: '财务风险', level: 'red', triggerTime: '2026-05-12 09:30:00', status: 'pending', description: 'XX集团负债同比增长12.5%，超过预警阈值' },
  { id: 'w2', ruleId: 't1', ruleName: '先执行后补程序', category: '三重一大', level: 'red', triggerTime: '2026-05-11 14:20:00', status: 'processing', description: 'XX项目已开工但未完成决策程序' },
  { id: 'w3', ruleId: 'p1', ruleName: '用工超编', category: '招聘人事', level: 'orange', triggerTime: '2026-05-10 16:45:00', status: 'resolved', description: 'XX公司实有人数超管控数15人' },
  { id: 'w4', ruleId: 'b2', ruleName: '串标嫌疑', category: '招标采购', level: 'orange', triggerTime: '2026-05-12 10:15:00', status: 'pending', description: 'XX项目三家投标单位报价相似度85%' },
  { id: 'w5', ruleId: 'm1', ruleName: '大额资金支出', category: '资金司库', level: 'red', triggerTime: '2026-05-12 11:00:00', status: 'pending', description: 'XX集团单笔支付500万元' }
];

interface WarningState {
  rules: WarningRule[];
  records: WarningRecord[];
  loading: boolean;
  error: string | null;
  
  // 查询功能
  getRuleById: (id: string) => WarningRule | undefined;
  getRulesByCategory: (category: string) => WarningRule[];
  getRulesByLevel: (level: WarningLevel) => WarningRule[];
  searchRules: (keyword: string) => WarningRule[];
  
  // CRUD操作
  addRule: (rule: Omit<WarningRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRule: (id: string, updates: Partial<WarningRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  duplicateRule: (id: string) => void;
  
  // 批量操作
  batchEnable: (ids: string[]) => void;
  batchDisable: (ids: string[]) => void;
  batchDelete: (ids: string[]) => void;
  
  // 记录操作
  setRecords: (records: WarningRecord[]) => void;
  updateRuleStatus: (id: string, status: WarningRecord['status']) => void;
  importRules: (rules: WarningRule[]) => void;
  exportRules: () => WarningRule[];
}

export const useWarningStore = create<WarningState>()(
  persist(
    (set, get) => ({
      rules: initialRules,
      records: initialRecords,
      loading: false,
      error: null,
      
      // 查询功能
      getRuleById: (id: string) => {
        return get().rules.find(rule => rule.id === id);
      },
      
      getRulesByCategory: (category: string) => {
        return get().rules.filter(rule => rule.category === category);
      },
      
      getRulesByLevel: (level: WarningLevel) => {
        return get().rules.filter(rule => rule.level === level);
      },
      
      searchRules: (keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        return get().rules.filter(rule => 
          rule.name.toLowerCase().includes(lowerKeyword) ||
          rule.condition.toLowerCase().includes(lowerKeyword) ||
          rule.category.toLowerCase().includes(lowerKeyword) ||
          rule.source.toLowerCase().includes(lowerKeyword)
        );
      },
      
      // CRUD操作
      addRule: (rule: Omit<WarningRule, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newRule: WarningRule = {
          ...rule,
          id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          rules: [...state.rules, newRule]
        }));
      },
      
      updateRule: (id: string, updates: Partial<WarningRule>) => {
        set((state) => ({
          rules: state.rules.map(rule => 
            rule.id === id 
              ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
              : rule
          )
        }));
      },
      
      deleteRule: (id: string) => {
        set((state) => ({
          rules: state.rules.filter(rule => rule.id !== id)
        }));
      },
      
      toggleRule: (id: string) => {
        set((state) => ({
          rules: state.rules.map(rule => 
            rule.id === id 
              ? { ...rule, enabled: !rule.enabled, updatedAt: new Date().toISOString() }
              : rule
          )
        }));
      },
      
      duplicateRule: (id: string) => {
        const rule = get().rules.find(r => r.id === id);
        if (rule) {
          const { id: _, createdAt, updatedAt, ...ruleData } = rule;
          const newRule: WarningRule = {
            ...ruleData,
            id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${rule.name} (复制)`,
            enabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          set((state) => ({
            rules: [...state.rules, newRule]
          }));
        }
      },
      
      // 批量操作
      batchEnable: (ids: string[]) => {
        set((state) => ({
          rules: state.rules.map(rule => 
            ids.includes(rule.id) 
              ? { ...rule, enabled: true, updatedAt: new Date().toISOString() }
              : rule
          )
        }));
      },
      
      batchDisable: (ids: string[]) => {
        set((state) => ({
          rules: state.rules.map(rule => 
            ids.includes(rule.id) 
              ? { ...rule, enabled: false, updatedAt: new Date().toISOString() }
              : rule
          )
        }));
      },
      
      batchDelete: (ids: string[]) => {
        set((state) => ({
          rules: state.rules.filter(rule => !ids.includes(rule.id))
        }));
      },
      
      // 记录操作
      setRecords: (records: WarningRecord[]) => {
        set({ records });
      },
      
      updateRuleStatus: (id: string, status: WarningRecord['status']) => {
        set((state) => ({
          records: state.records.map(r => 
            r.id === id ? { ...r, status } : r
          )
        }));
      },
      
      importRules: (rules: WarningRule[]) => {
        set((state) => ({
          rules: [...state.rules, ...rules]
        }));
      },
      
      exportRules: () => {
        return get().rules;
      }
    }),
    {
      name: 'warning-rules-storage',
      partialize: (state) => ({ rules: state.rules })
    }
  )
);
