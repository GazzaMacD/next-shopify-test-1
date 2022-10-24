import type { NextPage } from "next";
import * as React from "react";

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
}

export type TAuthAction =
  | {
      type: EAuthActionType.CREATE;
      payload: TCreateCustomerPayload;
    }
  | {
      type: EAuthActionType.LOGIN;
      payload: TLoginPayload;
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
  };
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
