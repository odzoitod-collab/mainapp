"use client";

import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <div className="err-boundary">
      <div className="err-boundary__ico" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.06" />
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 8v5M12 16h.01" strokeWidth="2" />
        </svg>
      </div>
      <p className="err-boundary__msg">
        {error?.message || "Что-то пошло не так"}
      </p>
      <button
        type="button"
        className="btn btn--ghost err-boundary__btn"
        onClick={onRetry}
      >
        Попробовать снова
      </button>
    </div>
  );
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <ErrorFallback error={this.state.error} onRetry={this.retry} />
      );
    }
    return this.props.children;
  }
}
