import type { NextPage } from "next";
import * as React from "react";

export type TNextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

/*
 * Cart & Product Types
 */

export type TProduct = {
  merchandiseId: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  price: string;
  currencyCode: string;
  altText: string;
  src: string;
};
export type TProductNoQ = TProduct;
export type TProductQ = TProduct & {
  quantity: number;
};
