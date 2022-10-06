import * as React from "react";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";

// Types
import { TNextPageWithLayout } from "@/common/types";

const FormSimple: TNextPageWithLayout = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>FormSimplify: French Fromage</title>
        <meta name="description" content="cart" />
        <link rel="icon" href="/cheese.png" />
      </Head>

      <main>
        <div className="container">
          <h1>SimpleForm</h1>
          <Form />
        </div>
      </main>
    </>
  );
};

FormSimple.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default FormSimple;

/* components */

function Form() {
  return <form></form>;
}
