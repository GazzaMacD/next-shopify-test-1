import * as React from "react";
import _ from "lodash";

// cart reducer, cart types and enums
import { ELS_Keys } from "@/common/constants";

export type TCartLineItem = {
  merchandiseId: string;
  quantity: number;
};
export type TCartLines = TCartLineItem[];
export type TCartLinesDict = {
  [id: string]: TCartLineItem;
};

export enum EActionType {
  ADD = `ADD`,
  INCREMENT = `INCREMENT`,
  DECREMENT = `DECREMENT`,
  REMOVE = `REMOVE`,
}
type TPayloadProduct = {
  merchandiseId: string;
  quantity: number;
};

type TAction =
  | {
      type: EActionType.ADD;
      payload: TPayloadProduct;
    }
  | {
      type: EActionType.INCREMENT;
      payload: TPayloadProduct;
    }
  | {
      type: EActionType.DECREMENT;
      payload: TPayloadProduct;
    }
  | {
      type: EActionType.REMOVE;
      payload: TPayloadProduct;
    };

type TDispatch = (action: TAction) => void;

type TCartProviderProps = { children: React.ReactNode };
/*
 * Cart Reducer
 */
function cartReducer(state: TCartLinesDict, action: TAction): TCartLinesDict {
  const merchId = action.payload.merchandiseId;
  const stateCpy = _.cloneDeep(state);

  switch (action.type) {
    case EActionType.ADD: {
      if (!(merchId in stateCpy)) {
        stateCpy[merchId] = action.payload;
      } else {
        stateCpy[merchId].quantity =
          stateCpy[merchId].quantity + action.payload.quantity;
      }
      return stateCpy;
    }
    case EActionType.INCREMENT: {
      if (merchId in stateCpy) {
        stateCpy[merchId].quantity = stateCpy[merchId].quantity + 1;
      }
      return stateCpy;
    }
    case EActionType.DECREMENT: {
      if (merchId in stateCpy && stateCpy[merchId].quantity > 0) {
        stateCpy[merchId].quantity = stateCpy[merchId].quantity - 1;
      }
      return stateCpy;
    }
    case EActionType.REMOVE: {
      delete stateCpy[merchId];
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
      state: TCartLinesDict;
      dispatch: TDispatch;
    }
  | undefined
>(undefined);

function init(initVal: TCartLinesDict) {
  if (
    typeof window !== `undefined` &&
    window.localStorage.getItem(ELS_Keys.CART)
  ) {
    return JSON.parse(window.localStorage.getItem(ELS_Keys.CART) ?? ``);
  }
  return initVal;
}

function CartProvider({ children }: TCartProviderProps) {
  const initValue: TCartLinesDict = {};
  const [state, dispatch] = React.useReducer(cartReducer, initValue, init);

  React.useEffect(() => {
    window.localStorage.setItem(ELS_Keys.CART, JSON.stringify(state));
  }, [state]);

  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  const { state, dispatch } = context;

  function addProduct(product: TPayloadProduct) {
    dispatch({
      type: EActionType.ADD,
      payload: product,
    });
  }
  function incProduct(product: TPayloadProduct) {
    dispatch({
      type: EActionType.INCREMENT,
      payload: product,
    });
  }
  function decProduct(product: TPayloadProduct) {
    dispatch({
      type: EActionType.DECREMENT,
      payload: product,
    });
  }
  function remProduct(product: TPayloadProduct) {
    dispatch({
      type: EActionType.REMOVE,
      payload: product,
    });
  }

  return { state, dispatch, addProduct, incProduct, remProduct, decProduct };
}

export { CartProvider, useCart };
