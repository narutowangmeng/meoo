import React from 'react';
import { Wallet } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function Treasury() {
  const { rules } = useWarningStore();
  const treasuryRules = rules.filter(r => r.category === '资金司库');

  return (
    <ModuleLayout
      title="资金司库预警"
      description="共7条预警规则，覆盖大额资金、支付审批、账户监控"
      category="资金司库"
      icon={Wallet}
      iconColor="text-rose-600"
      gradientColor="from-rose-500 to-pink-500"
      rules={treasuryRules}
    />
  );
}
