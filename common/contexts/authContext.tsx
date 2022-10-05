import * as React from "react";
import _ from "lodash";

import { gql } from "@/common/constants";
import { fetchShopifyGQL } from "@/common/utils/api";
import { ELS_Keys } from "@/common/constants";
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
type TAuthErrors = {
  code: `BLANK` | `INVALID` | `TAKEN`;
  field: string[];
  message: string;
}[];
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
      customerUserErrors: TAuthErrors;
    };
  };
  errors?: Record<string, unknown>[];
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

  async function createCustomer(newCustomer: TCreateCustomer) {
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
      if (errors) {
        throw new Error(JSON.stringify(errors));
      } else if (data) {
        return data.customerCreate;
      } else {
        throw new Error(`should not be here`);
      }
    } catch (error) {
      console.log(`\n=={ error in  }==\n`);
      console.error(error);
    }
  }

  return {
    state,
    dispatch,
    createCustomer,
  };
}

export { AuthProvider, useAuth };
