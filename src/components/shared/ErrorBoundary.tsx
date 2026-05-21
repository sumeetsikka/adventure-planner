import { Component, type ReactNode } from 'react';

/**
 * Catches render-time errors anywhere in its subtree and shows an editorial
 * fallback instead of a blank screen. Mounted around `<ResultsView>` so a
 * single broken tab never kills the whole results experience.
 *
 * React still surfaces the underlying error in the dev console / production
 * error reporting; this component is for UX, not for swallowing.
 */

interface Props {
  children: ReactNode;
  /** Optional label shown in the error pane to help users describe the issue. */
  label?: string;
  /** Optional reset handler — when provided, a "Reset" button appears. */
  onReset?: () => void;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // Surface to console; if Sentry is added later this is the hook point.
    console.error('[ErrorBoundary] caught:', error, info?.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  override render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error.message || 'Something went wrong';
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
        <div className="max-w-md text-center">
          <p className="eyebrow mb-4">Detour</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight mb-4">
            That section <em className="italic text-[var(--terracotta)]">stumbled</em>.
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-2 font-light">
            {this.props.label ? `The ${this.props.label} ran into a problem.` : 'A part of the app failed to render.'} Reloading usually clears it.
          </p>
          <p className="text-[var(--text-dim)] text-[11px] font-mono mb-8 break-all">{message}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.reset}
              className="px-5 py-2.5 rounded-full text-xs tracking-widest uppercase border border-[var(--line-strong)] text-[var(--cream)] hover:bg-[var(--ink-3)] transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[var(--terracotta)] text-white hover:opacity-90 transition-opacity text-xs font-medium tracking-wide"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
