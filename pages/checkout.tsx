import * as React from "react";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
//import styles from "@/styles/page-styles/Checkout.module.scss";
// Types
import { TNextPageWithLayout } from "@/common/types";

const Checkout: TNextPageWithLayout = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Checkout : French Fromage</title>
        <meta name="description" content="cart" />
        <link rel="icon" href="/cheese.png" />
      </Head>

      <main>
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </main>
    </>
  );
};

Checkout.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default Checkout;

/*
 * Components
 */
