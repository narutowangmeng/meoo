import React, { useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Bell,
  Menu,
  X,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  User,
  Database
} from 'lucide-react';

const navigation = [
  { name: '监控驾驶舱', href: '/', icon: LayoutDashboard },
  { name: '规则引擎', href: '/rules', icon: Settings },
  { name: '预警记录', href: '/records', icon: Bell },
  { name: '数据分析', href: '/analysis', icon: BarChart3 },
  { name: '数据管理', href: '/data', icon: Database },
  { name: '系统配置', href: '/config', icon: FileText },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 移动端侧边栏遮罩 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.aside
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -280,
          width: 280
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-200 lg:translate-x-0 lg:static lg:h-screen`}
      >
        {/* Logo区域 */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">国资监管</h1>
            <p className="text-xs text-slate-500">AI预警系统</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isItemActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={() =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isItemActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 ${isItemActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {isItemActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">系统管理员</p>
              <p className="text-xs text-slate-500 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* 主内容区 */}
      <div className="lg:ml-0 min-h-screen flex flex-col">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* 面包屑 */}
              <nav className="hidden md:flex items-center gap-2 text-sm">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-slate-400 hover:text-slate-600 transition-colors'}
                >
                  首页
                </NavLink>
                {location.pathname !== '/' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-600 font-medium">
                      {navigation.find(n => n.href === location.pathname)?.name || '页面'}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* 系统状态 */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700">系统运行正常</span>
              </div>

              {/* 通知按钮 */}
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
