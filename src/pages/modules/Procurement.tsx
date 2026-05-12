import React from 'react';
import { ShoppingCart } from 'lucide-react';
import ModuleLayout from '../../components/ModuleLayout';
import { useWarningStore } from '../../store/warningStore';

export default function Procurement() {
  const { rules } = useWarningStore();
  const procurementRules = rules.filter(r => r.category === '招标采购');

  return (
    <ModuleLayout
      title="招标采购预警"
      description="共8条预警规则，覆盖采购合规、招投标流程、供应商管理"
      category="招标采购"
      icon={ShoppingCart}
      iconColor="text-amber-600"
      gradientColor="from-amber-500 to-yellow-500"
      rules={procurementRules}
    />
  );
}
