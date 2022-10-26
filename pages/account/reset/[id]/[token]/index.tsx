import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
//import styles from "@/styles/page-styles/ResetPassword.module.scss";
// Types
import { TNextPageWithLayout } from "@/common/types";

// target url example --> http://localhost:3000/account/reset/6495952142570/31a9f524e15f2c41f6242b656e821943-1666758599

const PasswordReset: TNextPageWithLayout = (): JSX.Element => {
  const router = useRouter();
  const { id, token } = router.query;
  console.log(`id: ${id}\ntoken: ${token}`);
  return (
    <>
      <Head>
        <title>Password Reset : French Fromage</title>
        <meta name="description" content="cart" />
        <link rel="icon" href="/cheese.png" />
      </Head>

      <main>
        <div className="container">
          <h1>Password Reset</h1>
        </div>
      </main>
    </>
  );
};

PasswordReset.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default PasswordReset;
