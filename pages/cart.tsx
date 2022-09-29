import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { FaCartPlus, FaTrashAlt } from "react-icons/fa";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { gql } from "@/common/constants";
import { fetchShopifyGQL } from "@/common/utils/api";
import styles from "@/styles/page-styles/Cart.module.scss";
import * as colors from "@/common/js_styles/colors";
import { useCart, EActionType } from "@/common/contexts/cartContext";
// Types
import { TNextPageWithLayout } from "@/common/types";

import { redirect } from "next/dist/server/api-utils";

const Cart: TNextPageWithLayout = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Cart : French Fromage</title>
        <meta name="description" content="cart" />
        <link rel="icon" href="/cheese.png" />
      </Head>

      <main className={styles.CartPage}>
        <div className="container">
          <h1>Your Cart</h1>
          <div className={styles.Cart}>
            <CartTable />
            <CartSummary />
          </div>
        </div>
      </main>
    </>
  );
};

Cart.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default Cart;

/*
 * Components
 */

// 9/12
function CartTable() {
  const {
    state: cart,
    addProduct,
    remProduct,
    incProduct,
    decProduct,
  } = useCart();

  const [isEmpty, setIsEmpty] = React.useState(true);
  React.useEffect(() => {
    setIsEmpty(!Object.values(cart).length);
  }, [cart]);

  return (
    <div className={styles.CTable}>
      <h2>Cart Items</h2>
      {isEmpty ? (
        <table>
          <tbody>
            <tr>
              <td>Sorry no products at this time</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table>
          <tbody>
            {Object.values(cart).map((product) => {
              return (
                <tr key={product.merchandiseId}>
                  <td>{product.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
// 3/12
function CartSummary() {
  const { state: cart } = useCart();
  const cartArr = Object.values(cart);
  const isEmpty = !cartArr.length;
  return (
    <div className={styles.CSummary}>
      <h2>Cart Summary</h2>
    </div>
  );
}
