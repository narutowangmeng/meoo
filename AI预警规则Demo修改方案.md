# 市县国资监管一张网AI预警规则Demo修改方案

## 一、现状分析

### 1.1 文档规则概况
根据《市县国资监管一张网AI预警规则V1.0》文档，共有**77条预警规则**，覆盖9大领域：

| 领域 | 规则数量 | 关键规则示例 |
|------|---------|-------------|
| 财务风险 | 22条 | 资产负债异常、负债增长过快、成本费用异常 |
| 三重一大 | 3条 | 先执行后补程序、前置研究未履行、资金拆分规避 |
| 招聘人事 | 6条 | 用工超编、中层超配、招聘程序违规 |
| 投资项目 | 8条 | 超预算投资、项目逾期、计划外投资 |
| 招标采购 | 8条 | 应招未招、串标嫌疑、结算付款合规 |
| 资产管理 | 7条 | 账实不符、闲置资产超比例、权证缺失 |
| 资金司库 | 7条 | 大额资金支出、超预算支付、资金归集异常 |
| 党建廉洁 | 8条 | 违规兼职、八项规定违反、信访举报 |
| 综合监管 | 8条 | 预警过多、瞒报漏报、数据异常 |

### 1.2 现有Demo问题诊断

#### 🔴 核心问题（优先级：高）

**1. 规则增删改查功能缺失**
- 当前仅实现了规则的**列表展示**和**启用/禁用切换**
- **新增规则**：弹窗表单只是UI占位，点击"创建规则"无实际功能
- **编辑规则**：编辑按钮无点击事件处理
- **删除规则**：删除按钮无点击事件处理
- **复制规则**：复制按钮无点击事件处理
- 表单数据没有绑定状态管理

**2. 规则数据结构不完整**
当前`WarningRule`接口缺少文档中的关键字段：
```typescript
// 当前只有这些字段
interface WarningRule {
  id: string;
  category: string;
  name: string;
  condition: string;
  level: WarningLevel;
  frequency: string;
  action: string;
  source: string;
  enabled: boolean;
}

// 文档中规则包含的完整字段
interface CompleteWarningRule {
  id: string;
  category: string;      // 所属分类
  name: string;          // 预警指标
  condition: string;     // 触发条件
  level: WarningLevel;   // 预警级别
  frequency: string;     // 触发频率
  action: string;        // 处置要求
  source: string;        // 数据来源/基础字段
  logic: string;         // 计算逻辑（缺失！）
  policyBasis: string;   // 制度依据（缺失！）
  policyClause: string;  // 具体制度条款（缺失！）
  enabled: boolean;
  createdAt: string;     // 创建时间（缺失！）
  updatedAt: string;     // 更新时间（缺失！）
}
```

**3. 规则数据与文档不符**
- Demo中只有22条示例规则
- 文档规定应有77条完整规则
- 规则内容过于简化，缺少计算逻辑、制度依据等核心信息

#### 🟡 样式问题（优先级：中）

**1. 视觉设计问题**
- 整体配色偏灰，缺乏政府/国企系统的庄重感
- 卡片阴影过重，显得臃肿
- 预警级别颜色不够鲜明，红色预警不够醒目
- 字体层级不清晰，信息密度过高

**2. 交互体验问题**
- 规则列表行高过低，阅读困难
- 操作按钮过于紧凑，容易误触
- 弹窗表单字段布局不合理，缺少分组
- 缺少规则详情查看功能

**3. 响应式问题**
- 统计卡片在小屏幕下会挤压变形
- 表格没有横向滚动处理

---

## 二、修改方案

### 2.1 数据层改造

#### 2.1.1 扩展规则数据模型

```typescript
// src/store/warningStore.ts

export interface WarningRule {
  id: string;
  category: string;
  name: string;
  condition: string;
  level: WarningLevel;
  frequency: string;
  action: string;
  source: string;
  logic: string;           // 新增：计算逻辑
  policyBasis: string;     // 新增：制度依据
  policyClause: string;    // 新增：具体制度条款
  description?: string;    // 新增：规则说明
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;      // 新增：创建人
}

// 规则分类配置
export const categoryConfig = {
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
export const levelConfig = {
  red: { 
    color: '#dc2626', 
    bg: '#fef2f2', 
    border: '#fecaca',
    text: 'text-red-600',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    label: '红色预警',
    description: '违规、违法、重大风险已现实化',
    action: '立即上报，立即处置，启动追责'
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
    action: '约谈主要负责人，要求限期整改'
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
    action: '系统通知，纳入考核，要求说明'
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
    action: '系统提示，锁定数据待审核'
  }
};
```

#### 2.1.2 完善Store功能

```typescript
// src/store/warningStore.ts

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
  
  // 其他
  updateRuleStatus: (id: string, status: WarningRecord['status']) => void;
  importRules: (rules: WarningRule[]) => void;
  exportRules: () => WarningRule[];
}
```

### 2.2 功能层改造

#### 2.2.1 规则列表页增强

**新增功能：**
1. **批量选择**：checkbox选择多条规则进行批量操作
2. **高级筛选**：按分类、级别、状态、创建时间筛选
3. **排序功能**：按名称、创建时间、更新时间排序
4. **视图切换**：列表视图/卡片视图切换
5. **分页功能**：每页显示数量控制
6. **规则详情抽屉**：点击规则行展开详情，而非直接编辑

**操作按钮优化：**
```
单行操作：
- [查看详情] → 打开右侧抽屉展示完整规则信息
- [编辑] → 打开编辑弹窗
- [复制] → 复制规则并打开编辑弹窗
- [删除] → 确认后删除
- [启用/禁用] → 切换开关

批量操作（选中多条后显示）：
- [批量启用]
- [批量禁用]
- [批量删除]
- [导出选中]
```

#### 2.2.2 规则编辑/新增弹窗重构

**表单分组设计：**
```
┌─────────────────────────────────────────┐
│ 新建/编辑预警规则                          │
├─────────────────────────────────────────┤
│ 【基本信息】                              │
│   规则名称*  [____________________]      │
│   所属分类*  [▼ 财务风险]                │
│   预警级别*  [●红色 ○橙色 ○黄色 ○蓝色]   │
│   触发频率*  [▼ 月度触发]                │
│                                          │
│ 【触发条件】                              │
│   触发条件*  [____________________]      │
│   计算逻辑*  [                            │
│               // JavaScript表达式        │
│               return data.ratio > 0.8;   │
│              ]                           │
│                                          │
│ 【数据来源】                              │
│   数据来源*  [____________________]      │
│   基础字段   [____________________]      │
│                                          │
│ 【处置要求】                              │
│   处置要求*  [____________________]      │
│                                          │
│ 【制度依据】                              │
│   制度依据   [____________________]      │
│   具体条款   [____________________]      │
│   规则说明   [____________________]      │
│                                          │
│   [取消]          [保存]                 │
└─────────────────────────────────────────┘
```

**字段验证规则：**
- 规则名称：必填，2-50字符，同分类下不能重复
- 所属分类：必填，下拉选择
- 预警级别：必填，单选
- 触发频率：必填，下拉选择
- 触发条件：必填，10-200字符
- 计算逻辑：必填，支持JavaScript语法校验
- 数据来源：必填
- 处置要求：必填

#### 2.2.3 规则详情抽屉

```
┌──────────────────────────────────┐
│ 规则详情                    [×]  │
├──────────────────────────────────┤
│ 资产负债率异常预警                │
│ 🔴 红色预警  |  财务风险          │
├──────────────────────────────────┤
│ 【触发条件】                      │
│ 资产负债率 > 80%                  │
│                                  │
│ 【计算逻辑】                      │
│ ```javascript                    │
│ return data.assetLiabilityRatio  │
│        > 0.8;                    │
│ ```                              │
│                                  │
│ 【数据来源】                      │
│ 财务系统 / 资产总额、负债总额      │
│                                  │
│ 【处置要求】                      │
│ 立即上报国资委，启动风险处置程序   │
│                                  │
│ 【制度依据】                      │
│ 《市属国有企业绩效考评办法》       │
│ 具体条款：第三章第十二条          │
│                                  │
│ 【统计信息】                      │
│ 创建时间：2026-01-15 10:30       │
│ 更新时间：2026-05-12 14:20       │
│ 创建人：系统管理员                │
│ 触发次数：12次                    │
│                                  │
│ [编辑]  [复制]  [删除]           │
└──────────────────────────────────┘
```

### 2.3 UI/UX改造

#### 2.3.1 整体风格调整

**色彩系统重构：**
```css
/* 主色调 - 政府/国企蓝 */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;

/* 预警级别色 */
--level-red: #dc2626;      /* 更醒目的红 */
--level-orange: #ea580c;   /* 标准橙 */
--level-yellow: #ca8a04;   /* 暗金 */
--level-blue: #2563eb;     /* 标准蓝 */

/* 中性色 */
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;
```

**布局优化：**
- 增加页面边距，从`p-6`改为`p-8`
- 卡片圆角统一为`rounded-lg`（8px）
- 阴影调整为`shadow-sm`，更克制
- 统计卡片改为横向滚动，避免挤压

#### 2.3.2 规则列表样式优化

**列表项设计：**
```
┌────────────────────────────────────────────────────────────┐
│ [✓] │ 🔴 │ 资产负债率异常预警                    │ 财务风险 │
│     │    │ 触发条件：资产负债率 > 80%            │ 月度触发 │
│     │    │ 数据来源：财务系统                     │          │
├─────┴────┴────────────────────────────────────────┴──────────┤
│ [✓] │ 🟠 │ 负债增长过快预警                      │ 财务风险 │
│     │    │ 触发条件：负债同比增长 > 10%           │ 月度触发 │
│     │    │ 数据来源：财务系统                     │          │
└────────────────────────────────────────────────────────────┘
```

**改进点：**
- 增加行高，从`p-4`改为`py-4 px-6`
- 预警级别图标放大，更醒目
- 操作按钮改为hover时显示，减少视觉干扰
- 增加斑马纹背景，提升可读性

#### 2.3.3 统计面板优化

**新设计：**
```
┌──────────────────────────────────────────────────────────────┐
│ 规则概览                                          [导出报表] │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │   77     │ │   68     │ │   9      │ │   23     │        │
│  │ 规则总数  │ │ 已启用   │ │ 已禁用   │ │ 本月新增  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├──────────────────────────────────────────────────────────────┤
│  预警级别分布                                                │
│  🔴 红色(12)  🟠 橙色(18)  🟡 黄色(25)  🔵 蓝色(22)          │
├──────────────────────────────────────────────────────────────┤
│  分类分布（横向条形图）                                       │
│  财务风险 ████████████████████ 22                           │
│  三重一大 ███ 3                                             │
│  招聘人事 ██████ 6                                          │
│  ...                                                       │
└──────────────────────────────────────────────────────────────┘
```

### 2.4 数据初始化

#### 2.4.1 导入完整77条规则

需要按照文档内容，将77条规则完整录入到`initialRules`中：

```typescript
const initialRules: WarningRule[] = [
  // 财务风险 - 22条
  {
    id: 'f1',
    category: '财务风险',
    name: '资产负债异常',
    condition: '资产增加额小于负债增加额',
    level: 'orange',
    frequency: '月度触发',
    action: '纳入年度考核扣分',
    source: '财务系统/资产总额、负债总额',
    logic: '资产增加额 vs 负债增加额对比分析',
    policyBasis: '市属国有企业绩效考评办法',
    policyClause: '市属国有企业绩效考评办法"三升一降"',
    enabled: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  // ... 其他21条财务风险规则
  
  // 三重一大 - 3条
  // 招聘人事 - 6条
  // 投资项目 - 8条
  // 招标采购 - 8条
  // 资产管理 - 7条
  // 资金司库 - 7条
  // 党建廉洁 - 8条
  // 综合监管 - 8条
];
```

---

## 三、实施计划

### 阶段一：数据层改造（1天）
- [ ] 扩展`WarningRule`接口，添加缺失字段
- [ ] 完善`warningStore`，实现所有CRUD方法
- [ ] 录入完整的77条规则数据

### 阶段二：核心功能开发（2天）
- [ ] 重构规则列表页，实现批量选择、高级筛选
- [ ] 实现规则详情抽屉组件
- [ ] 重构新增/编辑弹窗，完善表单验证
- [ ] 实现删除、复制功能

### 阶段三：UI优化（1天）
- [ ] 调整整体配色方案
- [ ] 优化列表样式和交互
- [ ] 重构统计面板
- [ ] 优化弹窗和抽屉样式

### 阶段四：测试完善（1天）
- [ ] 功能测试：增删改查、批量操作
- [ ] 数据验证：确保77条规则完整准确
- [ ] 样式测试：多分辨率适配
- [ ] 交互测试：表单验证、错误提示

---

## 四、技术要点

### 4.1 表单验证
使用`react-hook-form` + `zod`进行表单验证：

```typescript
import { z } from 'zod';

const ruleSchema = z.object({
  name: z.string()
    .min(2, '规则名称至少2个字符')
    .max(50, '规则名称最多50个字符'),
  category: z.string().min(1, '请选择所属分类'),
  level: z.enum(['red', 'orange', 'yellow', 'blue']),
  frequency: z.string().min(1, '请选择触发频率'),
  condition: z.string()
    .min(10, '触发条件描述至少10个字符')
    .max(200, '触发条件描述最多200个字符'),
  logic: z.string().min(1, '请输入计算逻辑'),
  source: z.string().min(1, '请输入数据来源'),
  action: z.string().min(1, '请输入处置要求'),
  policyBasis: z.string().optional(),
  policyClause: z.string().optional(),
  description: z.string().optional()
});
```

### 4.2 代码编辑器
计算逻辑字段使用`@monaco-editor/react`提供代码编辑体验：

```typescript
import Editor from '@monaco-editor/react';

<Editor
  height="150px"
  language="javascript"
  theme="vs-dark"
  value={logic}
  onChange={setLogic}
  options={{
    minimap: { enabled: false },
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    fontSize: 13
  }}
/>
```

### 4.3 本地存储
使用`zustand`的持久化中间件保存数据：

```typescript
import { persist } from 'zustand/middleware';

export const useWarningStore = create<WarningState>()(
  persist(
    (set, get) => ({
      // ... state and methods
    }),
    {
      name: 'warning-rules-storage',
      partialize: (state) => ({ rules: state.rules })
    }
  )
);
```

---

## 五、预期效果

### 功能完整性
- ✅ 完整的77条规则数据
- ✅ 规则的增删改查功能
- ✅ 批量操作支持
- ✅ 高级筛选和搜索
- ✅ 规则详情查看

### 用户体验
- ✅ 清晰的视觉层级
- ✅ 流畅的交互反馈
- ✅ 完善的表单验证
- ✅ 友好的错误提示

### 代码质量
- ✅ 完整的数据模型
- ✅ 健壮的类型定义
- ✅ 可维护的组件结构
- ✅ 良好的性能表现
