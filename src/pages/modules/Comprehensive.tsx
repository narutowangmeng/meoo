import React from 'react';
import { BarChart3 } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function Comprehensive() {
  const { rules } = useWarningStore();
  const comprehensiveRules = rules.filter(r => r.category === '综合监管');

  return (
    <ModuleLayout
      title="综合监管预警"
      description="共8条预警规则，覆盖跨领域综合风险监测"
      category="综合监管"
      icon={BarChart3}
      iconColor="text-slate-600"
      gradientColor="from-slate-500 to-gray-500"
      rules={comprehensiveRules}
    />
  );
}
