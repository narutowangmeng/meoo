import React from 'react';
import { TrendingDown } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function FinancialRisk() {
  const { rules } = useWarningStore();
  const financialRules = rules.filter(r => r.category === '财务风险');

  return (
    <ModuleLayout
      title="财务风险预警"
      description="共22条预警规则，覆盖资产负债、成本费用、现金流、利润等关键财务指标"
      category="财务风险"
      icon={TrendingDown}
      iconColor="text-red-600"
      gradientColor="from-red-500 to-orange-500"
      rules={financialRules}
    />
  );
}
