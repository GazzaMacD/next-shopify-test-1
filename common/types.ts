import type { NextPage } from "next";
import * as React from "react";
import { string } from "yup";

export type TNextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

/*
 * Cart & Product Types
 */

export type TProduct = {
  merchandiseId: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  price: string;
  currencyCode: string;
  altText: string;
  src: string;
};
export type TProductNoQ = TProduct;
export type TProductQ = TProduct & {
  quantity: number;
};
/*
 * General Form Types
 */
export type TFormStatus = `idle` | `pending` | `success` | `error`;

/*
 * Auth Types
 */
export type TAuthState =
  | {
      customer: {
        displayName: string; // email, phone number or name
        email: string;
        firstName?: string;
        lastName?: string;
        acceptsMarketing?: boolean;
      } | null;
      accessToken: string | null;
      expiresAt: string | null;
    }
  | Record<string, never>; // empty object

export type TCreateCustomerPayload = {
  displayName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
};
export type TLoginPayload = {
  accessToken: string;
  expiresAt: string;
};

export enum EAuthActionType {
  CREATE = `CREATE`,
  LOGIN = `LOGIN`,
  LOGOUT = `LOGOUT`,
}

export type TAuthAction =
  | {
      type: EAuthActionType.CREATE;
      payload: TCreateCustomerPayload;
    }
  | {
      type: EAuthActionType.LOGIN;
      payload: TLoginPayload;
    }
  | {
      type: EAuthActionType.LOGOUT;
    };

export type TAuthDispatch = (action: TAuthAction) => void;

export type TAuthProviderProps = { children: React.ReactNode };

/* ===== types for useAuth ===== */
// Auth Base Types
export type TCustomerUserErrors = {
  code: `BLANK` | `INVALID` | `TAKEN` | `UNKNOWN` | `UNIDENTIFIED_CUSTOMER`;
  field: string[] | null;
  message: string;
}[];

export type TAPIBaseResponse = {
  errors?: Record<string, unknown>[];
};
export type TAPICustomer = {
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  acceptsMarketing: boolean;
};

// Customer Query Types
export type TAPICustomerQueryResponse = TAPIBaseResponse & {
  data?: {
    customer: TAPICustomer | null;
  };
};
// request password reset types
export type TRequestResetValues = {
  email: string;
};
export type TCustomerRecover = {
  customerUserErrors: TCustomerUserErrors;
} | null;

export type TAPIRequestReset = TAPIBaseResponse & {
  data?: {
    customerRecover: TCustomerRecover;
  };
};
export type TRequestResetResponse = {
  requestResetSuccess: boolean;
  customerUserErrors: TCustomerUserErrors;
};

// logout Customer Types
export type TCustomerAccessTokenDelete = {
  deletedAccessToken: string;
  deletedCustomerAccessTokenId: string;
  userErrors: {
    field: string;
    message: string;
  }[];
} | null;
export type TAPICustomerAccessTokenDelete = TAPIBaseResponse & {
  data?: {
    customerAccessTokenDelete: TCustomerAccessTokenDelete;
  };
};

// Customer Create Types
export type TCreateCustomer = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptsMarketing: boolean;
};
export type TAPICreateCustomerResponse = TAPIBaseResponse & {
  data?: {
    customerCreate: {
      customer: null | TAPICustomer;
      customerUserErrors: TCustomerUserErrors;
    };
  } | null;
};
export type TCreateCustomerResponse = {
  customer: null | TAPICustomer;
  customerUserErrors: TCustomerUserErrors;
};

//Customer Login Types
export type TEmailPassword = {
  email: string;
  password: string;
};
export type TLoginCustomerResponse = {
  loginSuccess: boolean;
  customerUserErrors: TCustomerUserErrors;
};
//api
export type TCustomerAccessTokenCreate = {
  customerUserErrors: TCustomerUserErrors;
  customerAccessToken: {
    accessToken: string;
    expiresAt: string;
  } | null;
};
export type TAPICustomerAccessTokenCreate = TAPIBaseResponse & {
  data?: {
    customerAccessTokenCreate: TCustomerAccessTokenCreate;
  };
};
