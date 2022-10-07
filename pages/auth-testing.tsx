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
 * 3. forms must be stylable with global form styles for consistency (X)
 * 4. all validation on server must map to field errors (o)
 * 5. form container must have various states available so success to display to user (x)
 * 6. Must have non field errors place (x)
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

/* error messages */
type TMsgLangs = Record<string, string>;
type TCommonErrMsgs = {
  required: TMsgLangs;
};
type TEmailErrMsgs = {
  invalid: TMsgLangs;
  taken: TMsgLangs;
};
type TErrMsgs = {
  email: TEmailErrMsgs;
  common: TCommonErrMsgs;
};
type TLocale = `en` | `ja` | `vn`;

const errMsgs: TErrMsgs = {
  common: {
    required: {
      en: `Required`,
      ja: ``,
      vn: ``,
    },
  },
  email: {
    invalid: {
      en: `Invalid email address`,
      ja: ``,
      vn: ``,
    },
    taken: {
      en: `This email is taken`,
      ja: ``,
      vn: ``,
    },
  },
};

/* form */
type TFSUFProps = {
  locale: TLocale;
};

const FSignUpForm = ({ locale = `en` }: TFSUFProps) => {
  const [emailsOk, setEmailsOk] = React.useState<string[]>([]);
  const { state, dispatch: authDispatch, createCustomer } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(errMsgs.common.required[locale])
      // use the test to check validity and also api call to check email is taken or not
      .test(
        `email`,
        async (
          value: string | undefined,
          testContext
        ): Promise<boolean | Yup.ValidationError> => {
          // required test will catch this
          if (!value) return true;
          // check validity of email
          if (
            typeof value === `string` &&
            !value.match(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
          ) {
            return testContext.createError({
              path: `email`,
              message: errMsgs.email.invalid[locale],
            });
          }
          try {
            if (!emailsOk.includes(value)) {
              //only enter if the email is not okayed already, avoids excess calls to api
              const res = await createCustomer({
                email: value as string,
                firstName: ``,
                lastName: ``,
                password: ``,
                acceptsMarketing: false,
              });
              const emailTaken =
                res &&
                res.customerUserErrors.length &&
                res.customerUserErrors.some(
                  (error) =>
                    error.field.includes(`email`) && error.code === `TAKEN`
                );
              if (emailTaken) {
                // return error if taken and message
                return testContext.createError({
                  path: `email`,
                  message: errMsgs.email.taken[locale],
                });
              }
              // if not taken then set email in emailsOkstate to avoid further api
              setEmailsOk((emailsOk) => [...emailsOk, value]);
            }
            return true;
          } catch (error) {
            return testContext.createError({
              path: `email`,
              message: `Oops, there is a problem, try again later`,
            });
          }
        }
      ), // end email
    firstName: Yup.string(),
    lastName: Yup.string(),
    password: Yup.string()
      .min(10, `Must be 10 characters or more`)
      .required(errMsgs.common.required[locale]),
    acceptsMarketing: Yup.boolean(),
  }); // end validationSchema

  const formik = useFormik({
    initialValues: initSignUpValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
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
      <FSignUpForm locale="en" />
    </div>
  );
};

// Basic CreateCustomerForm

type TCreateCustomerValues = {
  [key: string]: string | boolean | undefined;
};

type TStatus = `idle` | `pending` | `success` | `error`;

/*
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
  */
