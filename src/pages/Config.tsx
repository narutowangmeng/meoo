import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Mail, Shield, Database, Users,
  Key, Webhook, Save, Check, AlertTriangle,
  ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useWarningStore } from '../store/warningStore';

interface ConfigSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

const sections: ConfigSection[] = [
  { id: 'general', title: '基本设置', icon: Settings, description: '系统基本信息和运行参数' },
  { id: 'notification', title: '通知配置', icon: Bell, description: '预警通知方式和接收人设置' },
  { id: 'data', title: '数据源管理', icon: Database, description: '数据接入和同步配置' },
  { id: 'security', title: '安全设置', icon: Shield, description: '权限控制和访问安全' },
  { id: 'users', title: '用户管理', icon: Users, description: '系统用户和角色管理' },
  { id: 'api', title: 'API配置', icon: Webhook, description: '接口密钥和调用限制' },
];

export default function Config() {
  const { rules } = useWarningStore();
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // 配置状态
  const [config, setConfig] = useState({
    // 基本设置
    systemName: '市县国资监管一张网AI预警系统',
    systemVersion: 'V1.0.0',
    checkInterval: 5,
    dataRetentionDays: 365,
    
    // 通知配置
    enableEmail: true,
    enableSms: true,
    enableApp: false,
    emailRecipients: 'admin@example.com',
    smsRecipients: '138****8888',
    
    // 数据源
    autoSync: true,
    syncInterval: 60,
    dataSources: ['财务系统', '投资系统', '人事系统', '招投标系统'],
    
    // 安全
    loginRetry: 5,
    sessionTimeout: 30,
    ipWhitelist: '',
    
    // API
    apiEnabled: true,
    rateLimit: 1000,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderConfigContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">系统名称</label>
              <input
                type="text"
                value={config.systemName}
                onChange={(e) => handleChange('systemName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">系统版本</label>
              <input
                type="text"
                value={config.systemVersion}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">检测间隔（分钟）</label>
                <input
                  type="number"
                  value={config.checkInterval}
                  onChange={(e) => handleChange('checkInterval', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">数据保留天数</label>
                <input
                  type="number"
                  value={config.dataRetentionDays}
                  onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Database className="w-5 h-5" />
                <span className="font-medium">当前规则数量</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{rules.length} 条</p>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-800">邮件通知</p>
                <p className="text-sm text-slate-500">通过邮件发送预警通知</p>
              </div>
              <Toggle checked={config.enableEmail} onChange={(v) => handleChange('enableEmail', v)} />
            </div>
            {config.enableEmail && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">收件人邮箱</label>
                <input
                  type="text"
                  value={config.emailRecipients}
                  onChange={(e) => handleChange('emailRecipients', e.target.value)}
                  placeholder="多个邮箱用逗号分隔"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-800">短信通知</p>
                <p className="text-sm text-slate-500">通过短信发送紧急预警</p>
              </div>
              <Toggle checked={config.enableSms} onChange={(v) => handleChange('enableSms', v)} />
            </div>
            {config.enableSms && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">收件人手机</label>
                <input
                  type="text"
                  value={config.smsRecipients}
                  onChange={(e) => handleChange('smsRecipients', e.target.value)}
                  placeholder="多个手机号用逗号分隔"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-800">APP推送</p>
                <p className="text-sm text-slate-500">通过移动APP推送通知</p>
              </div>
              <Toggle checked={config.enableApp} onChange={(v) => handleChange('enableApp', v)} />
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-800">自动同步</p>
                <p className="text-sm text-slate-500">定时从数据源同步数据</p>
              </div>
              <Toggle checked={config.autoSync} onChange={(v) => handleChange('autoSync', v)} />
            </div>
            {config.autoSync && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">同步间隔（分钟）</label>
                <input
                  type="number"
                  value={config.syncInterval}
                  onChange={(e) => handleChange('syncInterval', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">已接入数据源</label>
              <div className="space-y-2">
                {config.dataSources.map((source, index) => (
                  <div key={source} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-slate-700">{source}</span>
                    </div>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">已连接</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
              + 添加数据源
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">登录重试次数</label>
                <input
                  type="number"
                  value={config.loginRetry}
                  onChange={(e) => handleChange('loginRetry', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">会话超时（分钟）</label>
                <input
                  type="number"
                  value={config.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">IP白名单</label>
              <textarea
                value={config.ipWhitelist}
                onChange={(e) => handleChange('ipWhitelist', e.target.value)}
                placeholder="每行一个IP地址，留空表示允许所有IP"
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">安全提示</p>
                <p className="text-sm text-yellow-700 mt-1">
                  建议定期更换管理员密码，并开启双因素认证以提高系统安全性。
                </p>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-blue-600">管</span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">系统管理员</p>
                  <p className="text-sm text-slate-500">admin@example.com</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">超级管理员</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-green-600">财</span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">财务审核员</p>
                  <p className="text-sm text-slate-500">finance@example.com</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">操作员</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-medium text-purple-600">审</span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">审计人员</p>
                  <p className="text-sm text-slate-500">audit@example.com</p>
                </div>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">查看员</span>
            </div>

            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
              + 添加用户
            </button>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-800">API接口</p>
                <p className="text-sm text-slate-500">允许外部系统调用API</p>
              </div>
              <Toggle checked={config.apiEnabled} onChange={(v) => handleChange('apiEnabled', v)} />
            </div>

            {config.apiEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">API密钥</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="sk-live-xxxxxxxxxxxxxxxxxxxx"
                      disabled
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono"
                    />
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                      重新生成
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">调用频率限制（次/小时）</label>
                  <input
                    type="number"
                    value={config.rateLimit}
                    onChange={(e) => handleChange('rateLimit', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium text-slate-700 mb-2">API文档</p>
                  <p className="text-sm text-slate-500 mb-3">查看完整的API接口文档和调用示例</p>
                  <button className="text-blue-600 text-sm hover:underline">查看文档 →</button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">系统配置</h1>
        <p className="text-slate-500 mt-1">管理系统参数和运行设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧菜单 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-2"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeSection === section.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <p className="font-medium">{section.title}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeSection === section.id ? 'rotate-90 text-blue-600' : 'text-slate-300'
                }`} />
              </button>
            );
          })}
        </motion.div>

        {/* 右侧内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-sm text-slate-500">
                  {sections.find(s => s.id === activeSection)?.description}
                </p>
              </div>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  saved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    已保存
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存设置
                  </>
                )}
              </button>
            </div>
            <div className="p-6">
              {renderConfigContent()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
