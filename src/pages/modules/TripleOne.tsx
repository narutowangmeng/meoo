import React from 'react';
import { FileText } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function TripleOne() {
  const { rules } = useWarningStore();
  const tripleOneRules = rules.filter(r => r.category === '三重一大');

  return (
    <ModuleLayout
      title="三重一大合规预警"
      description="共8条预警规则，覆盖决策程序、资金使用等关键环节"
      category="三重一大"
      icon={FileText}
      iconColor="text-purple-600"
      gradientColor="from-purple-500 to-pink-500"
      rules={tripleOneRules}
    />
  );
}
