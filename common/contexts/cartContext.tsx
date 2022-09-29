import * as React from "react";
import _ from "lodash";

// cart reducer, cart types and enums
import { ELS_Keys } from "@/common/constants";
import { TProduct } from "@/common/types";

export type TProductNoQ = TProduct;
export type TProductQ = TProduct & {
  quantity: number;
};

export type TCartLineItem = {
  merchandiseId: string;
  quantity: number;
};
export type TCartLinesDict = {
  [id: string]: TProductQ;
};

export enum EActionType {
  ADD = `ADD`,
  INCREMENT = `INCREMENT`,
  DECREMENT = `DECREMENT`,
  REMOVE = `REMOVE`,
}

type TAction =
  | {
      type: EActionType.ADD;
      payload: TProductQ;
    }
  | {
      type: EActionType.INCREMENT;
      payload: TProduct;
    }
  | {
      type: EActionType.DECREMENT;
      payload: TProduct;
    }
  | {
      type: EActionType.REMOVE;
      payload: TProduct;
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
      if (merchId in stateCpy && stateCpy[merchId].quantity > 1) {
        stateCpy[merchId].quantity = stateCpy[merchId].quantity - 1;
      } else if (merchId in stateCpy && stateCpy[merchId].quantity == 1) {
        delete stateCpy[merchId];
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

  function addProduct(product: TProductQ) {
    dispatch({
      type: EActionType.ADD,
      payload: product,
    });
  }
  function incProduct(product: TProduct) {
    dispatch({
      type: EActionType.INCREMENT,
      payload: product,
    });
  }
  function decProduct(product: TProduct) {
    dispatch({
      type: EActionType.DECREMENT,
      payload: product,
    });
  }
  function remProduct(product: TProduct) {
    dispatch({
      type: EActionType.REMOVE,
      payload: product,
    });
  }

  return { state, dispatch, addProduct, incProduct, remProduct, decProduct };
}

export { CartProvider, useCart };
