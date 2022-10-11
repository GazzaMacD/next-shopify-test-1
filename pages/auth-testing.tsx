import * as React from "react";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { SignupForm } from "@/components/forms/SignUpForm";

import styles from "@/styles/page-styles/Authtesting.module.scss";
/* ===================Objectives of this page ==================
 * 1. form in Formik (o)
 * 2. all validation on client side with Yup(o)
 * 3. forms must be consistent across app with least possible css (o)
 * 4. all validation on server must map to field errors (o)
 * 5. form container must have various states available so success to display to user (x)
 * 6. Must have non field errors place (x)
 * 7. Inputs with errors must be stylable (x)
 * 8. Deconstruct to create as separate, self containted library of styles and forms for better organization (x)
 * 9. Aria labels for accessibility
 */

// Types
import { TNextPageWithLayout } from "@/common/types";

const AuthTest: TNextPageWithLayout = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>AuthTest: French Fromage</title>
        <meta name="description" content="cart" />
        <link rel="icon" href="/cheese.png" />
      </Head>

      <main>
        <div className="container">
          <AuthWrapper />
        </div>
      </main>
    </>
  );
};

AuthTest.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default AuthTest;

/*
 * Components
 */

/* form wrapper */
const AuthWrapper = () => {
  return (
    <div className={styles.AuthWrapper}>
      <h2>Sign Up</h2>
      <SignupForm locale="en" />
    </div>
  );
};

// Basic CreateCustomerForm

type TCreateCustomerValues = {
  [key: string]: string | boolean | undefined;
};

type TStatus = `idle` | `pending` | `success` | `error`;
