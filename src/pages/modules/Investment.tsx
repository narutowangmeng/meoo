import React from 'react';
import { Briefcase } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function Investment() {
  const { rules } = useWarningStore();
  const investmentRules = rules.filter(r => r.category === '投资项目');

  return (
    <ModuleLayout
      title="投资项目预警"
      description="共8条预警规则，覆盖投资计划、项目进度、收益评估"
      category="投资项目"
      icon={Briefcase}
      iconColor="text-indigo-600"
      gradientColor="from-indigo-500 to-blue-500"
      rules={investmentRules}
    />
  );
}
