import * as React from "react";
import _ from "lodash";
import { gql } from "@/common/constants";
//app imports
import { fetchShopifyGQL } from "@/common/utils/api";
import { ELS_Keys } from "@/common/constants";
//type imports
import {
  EAuthActionType,
  TAPICreateCustomerResponse,
  TAPICustomerAccessTokenCreate,
  TAPICustomerAccessTokenDelete,
  TAPICustomerQueryResponse,
  TAuthAction,
  TAuthDispatch,
  TAuthProviderProps,
  TAuthState,
  TCreateCustomer,
  TCreateCustomerResponse,
  TEmailPassword,
  TLoginCustomerResponse,
} from "@/common/types";

/*
 * authReducer and AuthContext
 */

const initValue: TAuthState = {};

function authReducer(state: TAuthState, action: TAuthAction): TAuthState {
  const stateCpy = _.cloneDeep(state);

  switch (action.type) {
    case EAuthActionType.CREATE: {
      stateCpy.customer = action.payload;
      return stateCpy;
    }
    case EAuthActionType.LOGIN: {
      stateCpy.accessToken = action.payload.accessToken;
      stateCpy.expiresAt = action.payload.expiresAt;
      return stateCpy;
    }
    case EAuthActionType.LOGOUT: {
      return initValue;
    }
    default:
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
  }
}

/*
 * Auth Context
 */
const AuthContext = React.createContext<
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
  const [state, dispatch] = React.useReducer(authReducer, initValue, initAuth);

  React.useEffect(() => {
    window.localStorage.setItem(ELS_Keys.AUTH, JSON.stringify(state));
  }, [state]);

  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/*
 * useAuth Custom Hook
 */
function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  const { state, dispatch } = context;
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  //set is Authorized
  React.useEffect(() => {
    const checkAuth = async () => {
      if (!state?.accessToken) {
        setIsAuthorized(false);
        return;
      } else if (state.accessToken && state.expiresAt) {
        const expiry = new Date(state.expiresAt);
        const current = new Date();
        if (current >= expiry) {
          setIsAuthorized(false);
          return;
        }
        try {
          const customerQuery = gql`query{
            customer(customerAccessToken: "${state.accessToken}") {
              firstName
              lastName
              displayName
              email
            }
          }`;
          const { data, errors } =
            await fetchShopifyGQL<TAPICustomerQueryResponse>({
              query: customerQuery,
            });
          if (errors || !data?.customer) {
            setIsAuthorized(false);
            return;
          } else {
            //ok here
            setIsAuthorized(true);
          }
        } catch (error) {
          setIsAuthorized(false);
          return;
        } //catch
      } else {
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, [state]);

  //logout
  async function logoutCustomer() {
    //check for token if token then delete token on server
    if (state?.accessToken) {
      try {
        const tokenDeleteQuery = gql`
          mutation customerAccessTokenDelete($customerAccessToken: String!) {
            customerAccessTokenDelete(
              customerAccessToken: $customerAccessToken
            ) {
              deletedAccessToken
              deletedCustomerAccessTokenId
              userErrors {
                field
                message
              }
            }
          }
        `;
        const tokenDeleteVariables = {
          customerAccessToken: state.accessToken,
        };
        await fetchShopifyGQL<TAPICustomerAccessTokenDelete>({
          query: tokenDeleteQuery,
          variables: tokenDeleteVariables,
        });
      } catch (error) {
        console.error(error);
      }
    }
    // always set the auth context to empty object
    dispatch({
      type: EAuthActionType.LOGOUT,
    });
  }

  // login
  async function loginCustomer(
    loginValues: TEmailPassword
  ): Promise<TLoginCustomerResponse> {
    const response: TLoginCustomerResponse = {
      loginSuccess: false,
      customerUserErrors: [],
    };
    const tokenCreateQuery = gql`
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
    const tokenCreateVariables = {
      input: loginValues,
    };
    try {
      const { data: tokenCreateData, errors: tokenCreateErrors } =
        await fetchShopifyGQL<TAPICustomerAccessTokenCreate>({
          query: tokenCreateQuery,
          variables: tokenCreateVariables,
        });
      if (tokenCreateErrors) {
        throw new Error(JSON.stringify(tokenCreateErrors));
      } else if (
        tokenCreateData &&
        tokenCreateData.customerAccessTokenCreate.customerUserErrors.length
      ) {
        // has errors so throw and  errors on to catch
        throw new Error(`Errors in customeAccessTokenCreate`);
      } else if (
        tokenCreateData &&
        tokenCreateData.customerAccessTokenCreate?.customerAccessToken
      ) {
        //set authstate here
        dispatch({
          type: EAuthActionType.LOGIN,
          payload:
            tokenCreateData.customerAccessTokenCreate.customerAccessToken,
        });
        // get customer data here
        const customerQuery = gql`
        query{
          customer(customerAccessToken: "${tokenCreateData.customerAccessTokenCreate.customerAccessToken.accessToken}") {
            firstName
            lastName
            displayName
            email
          }
        }`;
        const { data: customerData, errors: customerErrors } =
          await fetchShopifyGQL<TAPICustomerQueryResponse>({
            query: customerQuery,
          });
        if (customerErrors || !customerData?.customer) {
          // something must be wrong with token so throw error
          // this is a double check, is it correct?
          throw new Error(`token error`);
        } else {
          //set customer on dispatch here
          dispatch({
            type: EAuthActionType.CREATE,
            payload: customerData.customer,
          });
        }
        return { ...response, loginSuccess: true };
      } else {
        throw new Error(`should not be here`);
      }
    } catch (error) {
      // no console.errors here for security
      // would be better to send errors here to some error service
      return {
        ...response,
        customerUserErrors: [
          {
            code: `UNKNOWN`,
            field: null,
            message: `Sorry, please try again!`,
          },
        ],
      };
    }
  } // end loginCustomer

  // create customer
  async function createCustomer(
    newCustomer: TCreateCustomer
  ): Promise<TCreateCustomerResponse> {
    const response = {
      customer: null,
      customerUserErrors: [],
    };
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
        // should be setting authContext state here for personalized message
        return { ...response, ...data.customerCreate };
      } else {
        throw new Error(`should not be here`);
      }
    } catch (error) {
      console.error(error);
      return {
        ...response,
        customerUserErrors: [
          {
            code: `UNKNOWN`,
            field: null,
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
    logoutCustomer,
    isAuthorized,
  };
}

export { AuthProvider, useAuth };
