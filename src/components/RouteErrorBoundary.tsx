import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export default class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Route content render failed:', error);
  }

  handleReset = () => {
    window.localStorage.removeItem('warning-rules-storage');
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-slate-800">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">页面内容加载失败</h2>
            <p className="mt-2 text-sm text-slate-600">
              当前主内容区出现运行时错误，通常是本地缓存数据和当前版本结构不兼容导致的。
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              <RefreshCw className="h-4 w-4" />
              清理本地缓存并刷新
            </button>
          </div>
        </div>
      </div>
    );
  }
}
