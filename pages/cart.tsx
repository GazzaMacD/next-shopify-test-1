import * as React from "react";
import Head from "next/head";
import Image from "next/image";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { CartIncDec } from "@/components/library/CartIncDec";
import { RemoveProdBtn } from "@/components/library/RemoveProdBtn";
import styles from "@/styles/page-styles/Cart.module.scss";
import { useCart } from "@/common/contexts/cartContext";
import { currency } from "@/common/utils/general";
import { DEFAULT_CURRENCY } from "@/common/constants";
// Types
import { TNextPageWithLayout } from "@/common/types";

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
  const { state: cart, perProductTotal, cartTotal } = useCart();
  const [isEmpty, setIsEmpty] = React.useState(true);
  const [currCode, setCurrCode] = React.useState(DEFAULT_CURRENCY);
  React.useEffect(() => {
    setIsEmpty(!Object.values(cart).length);
  }, [cart]);
  React.useEffect(() => {
    if (!isEmpty) {
      setCurrCode(Object.values(cart)[0].currencyCode);
    }
  }, [cart, isEmpty]);

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
                      code: currCode,
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
                      code: currCode,
                    })}
                  </td>
                  <td>
                    <RemoveProdBtn product={product} />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={4}>Total Price</th>
              <th>
                {currency({ price: String(cartTotal()), code: currCode })}
              </th>
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
