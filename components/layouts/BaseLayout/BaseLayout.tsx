import Head from "next/head";

import styles from "./BaseLayout.module.scss";
import { SITE_CONFIG } from "@/common/constants";

type TBaseLayout = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: TBaseLayout): JSX.Element => {
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.BaseLayout}>{children}</div>
    </>
  );
};

export { BaseLayout };
