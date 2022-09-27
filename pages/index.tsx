import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { FaCartPlus, FaTrashAlt } from "react-icons/fa";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { gql } from "@/common/constants";
import { fetchShopifyGQL } from "@/common/utils/api";
import styles from "@/styles/page-styles/Home.module.scss";
import * as colors from "@/common/js_styles/colors";
import { useCart, EActionType } from "@/common/contexts/cartContext";
// Types
import { TNextPageWithLayout } from "@/common/types";
import { redirect } from "next/dist/server/api-utils";

type TAPIPrice = {
  amount: string;
  currencyCode: string;
};

type TAPIPriceRange = {
  minVariantPrice: TAPIPrice;
};
type TAPIImage = {
  node: {
    altText: string;
    src: string;
  };
};

type TAPIImages = { edges: TAPIImage[] };

type TAPIProduct = {
  id: string;
  title: string;
  description: string;
  productType: string;
  handle: string;
  priceRange: TAPIPriceRange;
  images: TAPIImages;
};

type TErrors = {
  [key: string]: unknown;
}[];

type TAPIEdges = { node: TAPIProduct }[];

type TAPIProducts = {
  edges: {
    node: TAPIProduct;
  }[];
};

type TAPIResponse = {
  data?: {
    products: TAPIProducts;
  };
  errors?: TErrors;
};

// Types for component

type TProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  price: string;
  currencyCode: string;
  altText: string;
  src: string;
};

type TProducts = TProduct[];

type THomeProps = {
  products: TProducts;
};

//Components and Pages
type TControlsProps = {
  id: string;
  price: string;
  currencyCode: string;
};

const ProductCardControls = ({ id, price, currencyCode }: TControlsProps) => {
  const {
    state: cart,
    addProduct,
    remProduct,
    incProduct,
    decProduct,
  } = useCart();
  const isInCart = id in cart;
  return (
    <div className={styles.Controls}>
      <div className={styles.Controls__quantity}>
        <button
          onClick={() =>
            decProduct({
              merchandiseId: id,
              quantity: 1,
            })
          }
        >
          -
        </button>
        <span>{isInCart ? cart[id].quantity : 0}</span>
        <button
          onClick={() =>
            incProduct({
              merchandiseId: id,
              quantity: 1,
            })
          }
        >
          +
        </button>
      </div>
      <div className={styles.Controls__add}>
        <span>{currency({ price: price, code: currencyCode })}</span>
        {isInCart ? (
          <div
            className={styles.Controls__removeButton}
            onClick={() =>
              remProduct({
                merchandiseId: id,
                quantity: 1,
              })
            }
          >
            <FaTrashAlt />
          </div>
        ) : (
          <div
            className={styles.Controls__addButton}
            onClick={() =>
              addProduct({
                merchandiseId: id,
                quantity: 1,
              })
            }
          >
            <FaCartPlus />
          </div>
        )}
      </div>
    </div>
  );
};

const Home: TNextPageWithLayout<THomeProps> = ({ products }): JSX.Element => {
  return (
    <>
      <Head>
        <title>French Fromage</title>
        <meta name="description" content="First text of shopfiy with next.js" />
        <link rel="icon" href="/cheese.png" />
      </Head>

      <main className={styles.Home}>
        <div className="container">
          <h1>French Fromage</h1>

          {products.length ? (
            <ul className={styles.Products}>
              {products.map((product) => (
                <li key={product.id} className={styles.Product}>
                  <div className={styles.Product__image}>
                    <Image
                      src={product.src}
                      alt={product.altText}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </div>
                  <h3>
                    <span>{product.productType}: </span>
                    {product.title}
                  </h3>
                  <p>{product.description}</p>
                  <ProductCardControls
                    id={product.id}
                    price={product.price}
                    currencyCode={product.currencyCode}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Sorry no products at this time</p>
          )}
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <BaseLayout>
      <FrontLayout>{page}</FrontLayout>
    </BaseLayout>
  );
};

export default Home;

/*
 * SSR functions
 */

export async function getStaticProps() {
  const query = gql`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            productType
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 3) {
              edges {
                node {
                  altText
                  src
                }
              }
            }
          }
        }
      }
    }
  `;
  let products: TProducts = [];
  try {
    const { data, errors } = await fetchShopifyGQL<TAPIResponse>({ query });
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }
    if (data?.products?.edges) {
      products = createProducts(data?.products.edges);
    }
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.log(`\n=={ Home GetStaticProps }==\n`);
    console.error(error);
  }
}

// helper functions
function currency({ price, code }: { price: string; code: string }) {
  return new Intl.NumberFormat(`en`, {
    style: `currency`,
    currency: code,
  }).format(Number(price));
}
function createProducts(productEdges: TAPIEdges): TProducts {
  let products: TProducts = [];
  if (!productEdges.length) {
    return products;
  }
  products = productEdges.map((apiNode) => {
    const product = apiNode.node;
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      productType: product.productType,
      price: product.priceRange.minVariantPrice.amount,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      altText: product.images.edges[0].node.altText,
      src: product.images.edges[0].node.src,
    };
  });
  return products;
}
