import styles from "./CartIncDec.module.scss";
import * as React from "react";
import { useCart } from "@/common/contexts/cartContext";

// types
import { TProduct, TProductQ } from "@/common/types";

type TCIDecProps = {
  product: TProduct | TProductQ;
};

function CartIncDec({ product }: TCIDecProps) {
  const { state: cart, incProduct, decProduct } = useCart();
  // inCart --> in useEffect to avoid hydration errors
  const [inCart, setInCart] = React.useState(false);
  React.useEffect(() => {
    setInCart(product.merchandiseId in cart);
  }, [cart, product.merchandiseId]);

  return (
    <div className={styles.IncDec}>
      <button onClick={() => decProduct(product)}>-</button>
      <span>
        {inCart && cart[product.merchandiseId]?.quantity
          ? cart[product.merchandiseId].quantity
          : 0}
      </span>
      <button onClick={() => incProduct(product)}>+</button>
    </div>
  );
}

export { CartIncDec };
