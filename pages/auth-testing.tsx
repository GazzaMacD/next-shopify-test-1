import * as React from "react";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { useAuth, EAuthActionType } from "@/common/contexts/authContext";
import { useFormik } from "formik";
import * as Yup from "yup";

import styles from "@/styles/page-styles/Authtesting.module.scss";
/* ===================Objectives of this page ==================
 * 1. form in Formik (o)
 * 2. all validation on client side with Yup(o)
 * 3. forms must be stylable with global form styles for consistency (o)
 * 4. all validation on server must map to field errors (x)
 * 5. form container must have various states available so success for
 * example shows the user a new state (x)
 */

// Types
import { TNextPageWithLayout } from "@/common/types";
import { values } from "lodash";

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
          <FSignUp />
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

/* ======= Formik Signup Form ========= */
type TValues = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  acceptsMarketing: boolean;
};
const initSignUpValues: TValues = {
  email: ``,
  firstName: ``,
  lastName: ``,
  password: ``,
  acceptsMarketing: true,
};

/* validation function 
const signUpValidation = (values: TValues) => {
  const errors: Record<string, string> = {};
  // email
  if (!values.email) {
    errors.email = `Required`;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = `Invalid email address`;
  }
  // password
  if (!values.password) {
    errors.password = `Required`;
  } else if (values.password.length < 10) {
    errors.password = `Must be 10 characters or more`;
  }
  return errors;
};
*/
/* validation schema with yup */
type TMsgLangs = Record<string, string>;
type TEmailErrMsgs = {
  invalid: TMsgLangs;
  required: TMsgLangs;
};
type TErrMsgs = {
  email: TEmailErrMsgs;
};
type TLocale = `en` | `ja` | `vn`;

const errMsgs: TErrMsgs = {
  email: {
    invalid: {
      en: `Invalid email address`,
      ja: ``,
      vn: ``,
    },
    required: {
      en: `Required`,
      ja: ``,
      vn: ``,
    },
  },
};

/* form */
type TFSUFProps = {
  locale: TLocale;
};
const FSignUpForm = ({ locale = `en` }: { locale: string }) => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(`${errMsgs.email.invalid[locale]}`)
      .required(`Required`),
    firstName: Yup.string(),
    lastName: Yup.string(),
    password: Yup.string()
      .min(10, `Must be 10 characters or more`)
      .required(`Required`),
    acceptsMarketing: Yup.boolean(),
  });
  const formik = useFormik({
    initialValues: initSignUpValues,
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className={styles.AuthForm__text}>
        <label htmlFor="email">email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
      </div>
      <div className={styles.AuthForm__text}>
        <label htmlFor="firstName">given name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <div>{formik.errors.firstName}</div>
        ) : null}
      </div>
      <div className={styles.AuthForm__text}>
        <label htmlFor="lastName">family name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formik.values.lastName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <div>{formik.errors.lastName}</div>
        ) : null}
      </div>
      <div className={styles.AuthForm__text}>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
      </div>
      <div className={styles.AuthForm__row}>
        <input
          type="checkbox"
          id="acceptsMarketing"
          name="acceptsMarketing"
          checked={formik.values.acceptsMarketing}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <label htmlFor="accceptsMarketing">
          Would you like to receive emails from us?
        </label>
      </div>
      <div>
        <button type="submit">Create Account</button>
      </div>
    </form>
  );
};

/* form wrapper */
const FSignUp = () => {
  return (
    <div className={styles.AuthForm}>
      <h2>Sign Up</h2>
      <FSignUpForm />
    </div>
  );
};

// Basic CreateCustomerForm

type TCreateCustomerValues = {
  [key: string]: string | boolean | undefined;
};

type TStatus = `idle` | `pending` | `success` | `error`;

function CreateCustomerForm() {
  const initValues: TCreateCustomerValues = {
    email: ``,
    firstName: ``,
    lastName: ``,
    password: ``,
    acceptsMarketing: true,
  };

  const [status, setStatus] = React.useState<TStatus>(`idle`);
  const { state, dispatch: authDispatch, createCustomer } = useAuth();
  const [values, setValues] = React.useState<TCreateCustomerValues>(initValues);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setStatus(`pending`);
    event.preventDefault();
    const customerValues = {
      email: values.email as string,
      firstName: values.firstName as string,
      lastName: values.lastName as string,
      password: values.password as string,
      acceptsMarketing: values.acceptsMarketing as boolean,
    };
    console.log(`customerValues`, values);
    try {
      const res = await createCustomer(customerValues);
      if (res && res.customerUserErrors.length) {
        setStatus(`error`);
        console.log(`Errors`, res.customerUserErrors);
      } else if (res && res.customer) {
        setValues(initValues);
        authDispatch({
          type: EAuthActionType.CREATE,
          payload: res.customer,
        });
        setStatus(`success`);
      } else {
        throw new Error(`Shold not be here`);
      }
    } catch (error) {
      console.error(`Error in CreateCustomerForm.handleSubmit`);
      setStatus(`idle`);
    }
  }
  /* form jsx */
  let currentJSX = (
    <form noValidate onSubmit={handleSubmit}>
      <div className={styles.AuthForm__text}>
        <label htmlFor="email">email</label>
        <input type="email" id="email" name="email" onChange={handleChange} />
      </div>
      <div className={styles.AuthForm__text}>
        <label htmlFor="firstName">given name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          onChange={handleChange}
        />
      </div>
      <div className={styles.AuthForm__text}>
        <label htmlFor="lastName">family name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          onChange={handleChange}
        />
      </div>
      <div className={styles.AuthForm__text}>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
        />
      </div>
      <div className={styles.AuthForm__row}>
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
  );

  if (status === `success`) {
    currentJSX = (
      <div>
        <p>Success, welcome {state?.customer?.displayName}</p>
        <button onClick={() => setStatus(`idle`)}>Reset Form</button>
      </div>
    );
  }

  return (
    <div className={styles.AuthForm}>
      <h2>Create Account</h2>
      {currentJSX}
    </div>
  );
}
