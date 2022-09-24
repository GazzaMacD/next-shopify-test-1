import type { AppProps } from "next/app";
import { CartProvider } from "@/common/contexts/cartContext";
/*
import {
  ShopErrorBoundary,
  DefaultErrorFallback,
} from "@/components/elements/ErrorBoundary";
*/
import "@/styles/globals.scss";

// types
import { TNextPageWithLayout } from "@/common/types";

type TAppPropsWithLayout = AppProps & {
  Component: TNextPageWithLayout;
};

function MyApp({ Component, pageProps }: TAppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
