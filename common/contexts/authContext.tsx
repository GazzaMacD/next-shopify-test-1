import * as React from "react";
import _ from "lodash";

import { gql } from "@/common/constants";
import { fetchShopifyGQL } from "@/common/utils/api";
import { ELS_Keys } from "@/common/constants";
import { data } from "cypress/types/jquery";
// auth reducer

export type TAuthState =
  | {
      customer: {
        displayName: string; // email, phone number or name
        email: string;
        firstName?: string;
        lastName?: string;
        acceptsMarketing?: boolean;
      };
      accessToken?: string;
      expiresAt?: string;
    }
  | Record<string, never>; // empty object

export type TCreateCustomerPayload = {
  displayName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
};

export enum EAuthActionType {
  CREATE = `CREATE`,
}

type TAuthAction = {
  type: EAuthActionType.CREATE;
  payload: TCreateCustomerPayload;
};

/*
  | {
      type: EActionType.INCREMENT;
      payload: TProduct | TProductQ;
    }
  | {
      type: EActionType.DECREMENT;
      payload: TProduct | TProductQ;
    }
  | {
      type: EActionType.REMOVE;
      payload: TProduct;
    };
    */

type TAuthDispatch = (action: TAuthAction) => void;

type TAuthProviderProps = { children: React.ReactNode };

/* ===== types for useAuth ===== */
type TCustomerUserErrors = {
  code: `BLANK` | `INVALID` | `TAKEN` | `UNKNOWN` | `UNIDENTIFIED_CUSTOMER`;
  field: string[];
  message: string;
}[];
type TCustomerUserNonFieldErrors = { message: string }[];
// createCustomer
type TCreateCustomer = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptsMarketing: boolean;
};
type TAPICreatedCustomer = {
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  acceptsMarketing: boolean;
};
type TAPICreateCustomerResponse = {
  data?: {
    customerCreate: {
      customer: null | TAPICreatedCustomer;
      customerUserErrors: TCustomerUserErrors;
    };
  };
  errors?: Record<string, unknown>[];
};
type TCreateCustomerResponse = {
  customer: null | TAPICreatedCustomer;
  customerUserErrors: TCustomerUserErrors;
  customerUserNonFieldErrors: TCustomerUserNonFieldErrors;
};
/*
 * Customer Login Types
 */
type TEmailPassword = {
  email: string;
  password: string;
};
type TLoginCustomerResponse = {
  accessToken: string | null;
  expiresAt: string | null;
  customerUserErrors: TCustomerUserErrors;
  customerUserNonFieldErrors: TCustomerUserNonFieldErrors;
};
/*
 * authReducer
 */
function authReducer(state: TAuthState, action: TAuthAction): TAuthState {
  const stateCpy = _.cloneDeep(state);

  switch (action.type) {
    case EAuthActionType.CREATE: {
      stateCpy.customer = action.payload;
      return stateCpy;
    }
    default:
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
  }
}
/*
 * Cart Context
 */

const CartContext = React.createContext<
  | {
      state: TAuthState;
      dispatch: TAuthDispatch;
    }
  | undefined
>(undefined);

function initAuth(initVal: TAuthState) {
  if (
    typeof window !== `undefined` &&
    window.localStorage.getItem(ELS_Keys.AUTH)
  ) {
    return JSON.parse(window.localStorage.getItem(ELS_Keys.AUTH) ?? ``);
  }
  return initVal;
}

/*
 * AuthProvider
 */

function AuthProvider({ children }: TAuthProviderProps) {
  const initValue: TAuthState = {};
  const [state, dispatch] = React.useReducer(authReducer, initValue, initAuth);

  React.useEffect(() => {
    window.localStorage.setItem(ELS_Keys.AUTH, JSON.stringify(state));
  }, [state]);

  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/*
 * useAuth Custom Hook
 */
function useAuth() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  const { state, dispatch } = context;

  async function loginCustomer(
    loginValues: TEmailPassword
  ): Promise<TLoginCustomerResponse> {
    await Promise.resolve(`x`);
    const response = {
      accessToken: null,
      expiresAt: null,
      customerUserErrors: [],
      customerUserNonFieldErrors: [],
    };
    const query = gql`
      mutation customerAccessTokenCreate(
        $input: CustomerAccessTokenCreateInput!
      ) {
        customerAccessTokenCreate(input: $input) {
          customerUserErrors {
            code
            field
            message
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
        }
      }
    `;
    const variables = {
      input: loginValues,
    };
    try {
    } catch (error) {
      console.error(error);
      return {
        ...response,
        customerUserErrors: [],
        customerUserNonFieldErrors: [
          {
            message: `Oops! Sorry something went wrong, try again later please!`,
          },
        ],
      };
    }
    return response;
  } // end loginCustomer

  async function createCustomer(
    newCustomer: TCreateCustomer
  ): Promise<TCreateCustomerResponse> {
    const query = gql`
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            displayName
            email
            firstName
            lastName
            phone
            acceptsMarketing
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: newCustomer,
    };
    try {
      const { data, errors } =
        await fetchShopifyGQL<TAPICreateCustomerResponse>({
          query,
          variables,
        });
      const response = {
        customer: null,
        customerUserErrors: [],
        customerUserNonFieldErrors: [],
      };
      if (errors) {
        throw new Error(JSON.stringify(errors));
      } else if (data) {
        return { ...response, ...data.customerCreate };
      } else {
        throw new Error(`should not be here`);
      }
    } catch (error) {
      console.error(error);
      return {
        customer: null,
        customerUserErrors: [],
        customerUserNonFieldErrors: [
          {
            message: `Oops! Sorry something went wrong, try again later please!`,
          },
        ],
      };
    }
  }

  return {
    state,
    dispatch,
    createCustomer,
    loginCustomer,
  };
}

export { AuthProvider, useAuth };
