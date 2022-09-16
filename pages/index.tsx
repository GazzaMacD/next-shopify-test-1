import * as React from "react";
import _ from "lodash";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { Button } from "@/components/elements/Button";
import styles from "@/styles/page-styles/Home.module.scss";
import { CircleButton } from "@/components/lib";
import * as colors from "@/common/js_styles/colors";

// types
import { TNextPageWithLayout } from "@/common/types";

const Home: TNextPageWithLayout = (): JSX.Element => {
  const [showTestText, setShowTestText] = React.useState(false);
  //const cpyComplexObj = _.cloneDeep(complexObj);

  return (
    <>
      <Head>
        <title>Next App</title>
        <meta name="description" content="description here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.Home}>
        <h1 className={styles.Home__title}>Next.js Project Starter</h1>
        <CircleButton onClick={() => alert(`hi`)}>X</CircleButton>
        <Button clickHandler={() => setShowTestText(!showTestText)}>
          Test Button
        </Button>
        {showTestText && <p>Test text</p>}
        <div
          css={{
            backgroundColor: `${colors.green}`,
            height: `100px`,
          }}
        ></div>
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
