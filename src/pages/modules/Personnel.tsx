import React from 'react';
import { Users } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function Personnel() {
  const { rules } = useWarningStore();
  const personnelRules = rules.filter(r => r.category === '招聘人事');

  return (
    <ModuleLayout
      title="招聘与人事预警"
      description="共7条预警规则，覆盖用工编制、中层管理、招聘合规"
      category="招聘人事"
      icon={Users}
      iconColor="text-green-600"
      gradientColor="from-green-500 to-emerald-500"
      rules={personnelRules}
    />
  );
}
