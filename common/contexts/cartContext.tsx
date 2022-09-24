import * as React from "react";
import _ from "lodash";

// cart reducer types and cart types
export type TCartLineItem = {
  merchandiseId: string;
  quantity: number;
};
export type TCartLines = TCartLineItem[];

export enum ActionType {
  ADD = `ADD`,
  INCREMENT = `INCREMENT`,
  DECREMENT = `DECREMENT`,
  REMOVE = `REMOVE`,
}
interface IPayloadId {
  merchandiseId: string;
}

interface IPayloadFull extends IPayloadId {
  quantity: number;
}

type TAction =
  | {
      type: ActionType.ADD;
      payload: IPayloadFull;
    }
  | {
      type: ActionType.INCREMENT;
      payload: IPayloadId;
    }
  | {
      type: ActionType.DECREMENT;
      payload: IPayloadId;
    }
  | {
      type: ActionType.REMOVE;
      payload: IPayloadId;
    };

type TDispatch = (action: TAction) => void;

type TCartProviderProps = { children: React.ReactNode };
/*
 * Cart Reducer
 */
function cartReducer(state: TCartLines, action: TAction): TCartLines {
  switch (action.type) {
    case ActionType.ADD: {
      return [..._.cloneDeep(state), action.payload];
    }
    case ActionType.INCREMENT:
      return _.cloneDeep(state).map((lineItem) => {
        if (lineItem.merchandiseId === action.payload.merchandiseId) {
          return { ...lineItem, quantity: lineItem.quantity + 1 };
        }
        return lineItem;
      });
    case ActionType.DECREMENT:
      return _.cloneDeep(state).map((lineItem) => {
        if (lineItem.merchandiseId === action.payload.merchandiseId) {
          return {
            ...lineItem,
            quantity: lineItem.quantity > 1 ? lineItem.quantity - 1 : 0,
          };
        }
        return lineItem;
      });
    case ActionType.REMOVE: {
      return _.cloneDeep(state).filter(
        (lineItem) => lineItem.merchandiseId !== action.payload.merchandiseId
      );
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
      state: TCartLines;
      dispatch: TDispatch;
    }
  | undefined
>(undefined);

function CartProvider({ children }: TCartProviderProps) {
  const initValue: TCartLines = [];
  const [state, dispatch] = React.useReducer(
    cartReducer,
    initValue
  ); /* need to implement localStorage here  and in useEffect 

  React.useEffect(( ) => )
  */
  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
}

export { CartProvider, useCart };
