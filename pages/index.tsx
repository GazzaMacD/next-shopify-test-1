import * as React from "react";
import _ from "lodash";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { Button } from "@/components/elements/Button";
import styles from "@/styles/page-styles/Home.module.scss";
// types
import { TNextPageWithLayout } from "@/common/types";

const Home: TNextPageWithLayout = (): JSX.Element => {
  const [showTestText, setShowTestText] = React.useState(false);
  const complexObj = { nest: { complex: null } };
  const cpyComplexObj = _.cloneDeep(complexObj);
  console.log(cpyComplexObj);
  return (
    <>
      <Head>
        <title>Next App</title>
        <meta name="description" content="description here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.Home}>
        <h1 className={styles.Home__title}>Next.js Project Starter</h1>
        <br></br>
        <Button clickHandler={() => setShowTestText(!showTestText)}>
          Test Button
        </Button>
        <br></br>
        {showTestText && <p>Test text</p>}
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default Home;
