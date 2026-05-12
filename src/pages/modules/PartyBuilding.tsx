import React from 'react';
import { Flag } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function PartyBuilding() {
  const { rules } = useWarningStore();
  const partyRules = rules.filter(r => r.category === '党建廉洁');

  return (
    <ModuleLayout
      title="党建廉洁预警"
      description="共8条预警规则，覆盖党风廉政建设、廉洁风险防控"
      category="党建廉洁"
      icon={Flag}
      iconColor="text-red-700"
      gradientColor="from-red-600 to-red-400"
      rules={partyRules}
    />
  );
}
