import type { NextPage } from "next";
import * as React from "react";

export type TNextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

/* Next JS Layouts
export type TNextPageWithLayout<Props> = NextPage<Props> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};
*/
