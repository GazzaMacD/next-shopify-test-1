import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth, EAuthActionType } from "@/common/contexts/authContext";
import { Button } from "@/components/library/Button";
// styles
import formStyles from "@/components/forms/formStyles.module.scss";
import styles from "./LoginForm.module.scss";

// types /
type TValues = {
  email: string;
  password: string;
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

// helpers and consts /
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

const initLoginValues: TValues = {
  email: ``,
  password: ``,
};

/* form */
type TFSUFProps = {
  locale: TLocale;
};
type TStatus = `idle` | `pending` | `success` | `error`;
type TNonFieldErrors = {
  message: string;
}[];

const LoginForm = ({ locale = `en` }: TFSUFProps) => {
  const [emailsOk, setEmailsOk] = React.useState<string[]>([]);
  const { dispatch: authDispatch, createCustomer } = useAuth();
  const [status, setStatus] = React.useState<TStatus>(`idle`);
  const [nonFieldErrors, setNonFieldErrors] = React.useState<TNonFieldErrors>(
    []
  );
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(errMsgs.common.required[locale])
      // use the test to check validity and also api call to check email is taken or not
      .test(
        `email`,
        (
          value: string | undefined,
          testContext
        ): boolean | Yup.ValidationError => {
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
          return true;
        }
      ), // end email
    password: Yup.string()
      .min(10, `Must be 10 characters or more`)
      .required(errMsgs.common.required[locale]),
  }); // end validationSchema

  const formik = useFormik({
    initialValues: initLoginValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const msg = await new Promise((resolve) => resolve(`submit still to do`));
      alert(`${msg} \n ${JSON.stringify(values)}`);
    },
  });

  const formJSX = (
    <form noValidate onSubmit={formik.handleSubmit} aria-label="Login Form">
      {nonFieldErrors.length ? (
        <div className={formStyles.NonFieldError}>
          {nonFieldErrors.map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      ) : null}
      <div className={formStyles.VFormGroup}>
        <label htmlFor="email">email</label>
        <input
          className={`${formStyles.EmailInput} ${
            formik.touched.email && formik.errors.email
              ? formStyles.EmailInput__error
              : ``
          }`}
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
          aria-errormessage="email-error"
        />
        <div className={formStyles.FieldError}>
          {formik.touched.email && formik.errors.email ? (
            <span id="email-error">{formik.errors.email}</span>
          ) : null}
        </div>
      </div>

      <div className={formStyles.VFormGroup}>
        <label htmlFor="password">password</label>
        <input
          className={`${formStyles.PasswordInput} ${
            formik.touched.password && formik.errors.password
              ? formStyles.PasswordInput__error
              : ``
          }`}
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          aria-invalid={Boolean(
            formik.touched.password && formik.errors.password
          )}
          aria-errormessage="password-error"
        />
        <div className={formStyles.FieldError}>
          {formik.touched.password && formik.errors.password ? (
            <span id="password-error">{formik.errors.password}</span>
          ) : null}
        </div>
      </div>

      <div className={formStyles.LFormgroup}>
        <Button radius="4px" type="submit">
          Login
        </Button>
      </div>
    </form>
  );

  return formJSX;
};

export { LoginForm };
