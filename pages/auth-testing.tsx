import * as React from "react";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import styles from "@/styles/page-styles/Authtesting.module.scss";
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
          <h1>AuthTest</h1>
          <CreateCustomerForm />
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

type TCreateCustomerValues = {
  [key: string]: string | boolean | undefined;
};

function CreateCustomerForm() {
  const [values, setValues] = React.useState<TCreateCustomerValues>({
    email: ``,
    firstName: ``,
    lastName: ``,
    password: ``,
    acceptsMarketing: true,
  });
  console.log(values);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const valuesCopy = { ...values };
    const name = event.currentTarget.name;
    if (name in valuesCopy) {
      valuesCopy[name] = event.currentTarget.value;
    }
    setValues(valuesCopy);
  }

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    const valuesCopy = { ...values };
    const { name } = event.currentTarget;
    valuesCopy[name] = !valuesCopy[name];
    setValues(valuesCopy);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(values);
  }

  return (
    <div>
      <h2>Create Account</h2>
      <form noValidate onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">email</label>
          <input type="email" id="email" name="email" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="firstName">given name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">family name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="acceptsMarketing"
            name="acceptsMarketing"
            checked={Boolean(values.acceptsMarketing)}
            onChange={handleChecked}
          />
          <label htmlFor="accceptsMarketing">
            Would you like to receive emails from us?
          </label>
        </div>
        <div>
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}
