import React from 'react';
import { Building2 } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function Assets() {
  const { rules } = useWarningStore();
  const assetsRules = rules.filter(r => r.category === '资产管理');

  return (
    <ModuleLayout
      title="资产管理预警"
      description="共7条预警规则，覆盖资产盘点、处置合规、使用效率"
      category="资产管理"
      icon={Building2}
      iconColor="text-teal-600"
      gradientColor="from-teal-500 to-cyan-500"
      rules={assetsRules}
    />
  );
}
