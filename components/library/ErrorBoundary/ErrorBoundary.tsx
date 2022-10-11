/*
import React, { Component, ErrorInfo, ReactNode } from "react";
type TDEFallback = {
  reset: () => void;
};
type TProps = {
  children?: ReactNode;
  FallBackComponent: () => JSX.Element;
};

type TState = {
  hasError: boolean;
};

function DefaultErrorFallback({ reset }: TDEFallback) {}

class ShopErrorBoundary extends Component<TProps, TState> {
  public state: TState = {
    hasError: false,
  };

  reset = () => {
    this.setState({
      hasError: false,
    });
  };

  public static getDerivedStateFromError(_: Error): TState {
    console.log(`this is the error`, _);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Sorry.. there was an error</h1>
          <button onClick={this.reset}>Reset</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ShopErrorBoundary };
*/
export {};
