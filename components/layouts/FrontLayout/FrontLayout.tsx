import Head from "next/head";

import { SITE_CONFIG } from "@/common/constants";
import { Logo } from "@/components/elements/Logo";
import { GlobalHeader } from "@/components/modules/GlobalHeader";
import styles from "./FrontLayout.module.scss";

type TFLProps = {
  children: React.ReactNode;
};
const FrontLayout = ({ children }: TFLProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="icon" href="/cheese.png" />
      </Head>
      <GlobalHeader>
        <Logo />
      </GlobalHeader>
      {children}
    </>
  );
};

export { FrontLayout };
