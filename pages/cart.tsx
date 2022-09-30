import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { FaCartPlus, FaTrashAlt } from "react-icons/fa";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { gql } from "@/common/constants";
import { CartIncDec } from "@/components/elements/CartIncDec";
import { fetchShopifyGQL } from "@/common/utils/api";
import styles from "@/styles/page-styles/Cart.module.scss";
import * as colors from "@/common/js_styles/colors";
import { useCart, EActionType } from "@/common/contexts/cartContext";
import { currency } from "@/common/utils/general";
import { DEFAULT_CURRENCY } from "@/common/constants";
// Types
import { TNextPageWithLayout } from "@/common/types";

import { redirect } from "next/dist/server/api-utils";
import { is } from "cypress/types/bluebird";

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
    perProductTotal,
    cartTotal,
  } = useCart();

  const [isEmpty, setIsEmpty] = React.useState(true);
  React.useEffect(() => {
    setIsEmpty(!Object.values(cart).length);
  }, [cart]);

  const currCode = isEmpty ? `EUR` : Object.values(cart)[0].currencyCode;

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
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Line Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(cart).map((product) => {
              return (
                <tr key={product.merchandiseId}>
                  <td>{product.title}</td>
                  <td>
                    <Image
                      src={product.src}
                      alt={product.altText}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </td>
                  <td>
                    <CartIncDec product={product} />
                  </td>
                  <td>
                    {currency({
                      price: product.price,
                      code: product.currencyCode,
                    })}
                  </td>
                  <td>
                    {currency({
                      price: String(
                        perProductTotal({
                          price: product.price,
                          quantity: product.quantity,
                        })
                      ),
                      code: product.currencyCode,
                    })}
                  </td>
                  <td>del</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={4}>Total Price</th>
              <th>{currency({ price: String(cartTotal()), code: `EUR` })}</th>
              <th>
                <button>empty cart</button>
              </th>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
