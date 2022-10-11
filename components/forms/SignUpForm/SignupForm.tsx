import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth, EAuthActionType } from "@/common/contexts/authContext";
import { Button } from "@/components/library/Button";
// styles
import formStyles from "@/components/forms/formStyles.module.scss";
import styles from "./SignupForm.module.scss";

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
type TStatus = `idle` | `pending` | `success` | `error`;

const SignupForm = ({ locale = `en` }: TFSUFProps) => {
  const [emailsOk, setEmailsOk] = React.useState<string[]>([]);
  const { state, dispatch: authDispatch, createCustomer } = useAuth();
  const [status, setStatus] = React.useState<TStatus>(`idle`);
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
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        const res = await createCustomer(values);
        if (res && res.customerUserErrors.length) {
          formik.setSubmitting(false);
          setStatus(`error`);
          console.log(`Errors`, res.customerUserErrors);
        } else if (res && res.customer) {
          formik.setValues(initSignUpValues);
          authDispatch({
            type: EAuthActionType.CREATE,
            payload: res.customer,
          });
          formik.setSubmitting(false);
          setStatus(`success`);
        } else {
          formik.setSubmitting(false);
          throw new Error(`Shold not be here`);
        }
      } catch (error) {
        console.error(`Error in CreateCustomerForm.handleSubmit`);
        formik.setSubmitting(false);
        setStatus(`idle`);
      }
    },
  });

  const formJSX = (
    <form noValidate onSubmit={formik.handleSubmit} aria-label="Sign Up Form">
      <div className={formStyles.VFormGroup}>
        <label htmlFor="email">email</label>
        <input
          className={formStyles.EmailInput}
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
        <label htmlFor="firstName">given name</label>
        <input
          className={formStyles.TextInput}
          type="text"
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          aria-invalid={Boolean(
            formik.touched.firstName && formik.errors.firstName
          )}
          aria-errormessage="firstName-error"
        />
        <div className={formStyles.FieldError}>
          {formik.touched.firstName && formik.errors.firstName ? (
            <span id="firstName-error">{formik.errors.firstName}</span>
          ) : null}
        </div>
      </div>

      <div className={formStyles.VFormGroup}>
        <label htmlFor="lastName">family name</label>
        <input
          className={formStyles.TextInput}
          type="text"
          id="lastName"
          name="lastName"
          value={formik.values.lastName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          aria-invalid={Boolean(
            formik.touched.lastName && formik.errors.lastName
          )}
          aria-errormessage="lastName-error"
        />
        <div className={formStyles.FieldError}>
          {formik.touched.lastName && formik.errors.lastName ? (
            <span id="lastName-error">{formik.errors.lastName}</span>
          ) : null}
        </div>
      </div>

      <div className={formStyles.VFormGroup}>
        <label htmlFor="password">password</label>
        <input
          className={formStyles.PasswordInput}
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
        <input
          className={formStyles.CheckboxInput}
          type="checkbox"
          id="acceptsMarketing"
          name="acceptsMarketing"
          checked={formik.values.acceptsMarketing}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <label htmlFor="accceptsMarketing">
          I want to receive emails from you
        </label>
      </div>

      <div className={formStyles.LFormgroup}>
        <Button radius="4px" type="submit">
          Create Account
        </Button>
      </div>
    </form>
  );

  return formJSX;
};

export { SignupForm };