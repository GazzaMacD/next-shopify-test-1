import type { NextPage } from "next";

// Next JS Layouts
export type TNextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};
