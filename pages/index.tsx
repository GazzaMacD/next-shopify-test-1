import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { FaCartPlus, FaTrashAlt } from "react-icons/fa";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { gql } from "@/common/constants";
import { fetchShopifyGQL } from "@/common/utils/api";
import styles from "@/styles/page-styles/Home.module.scss";
import { useCart } from "@/common/contexts/cartContext";
import { currency } from "@/common/utils/general";
import { CartIncDec } from "@/components/library/CartIncDec";
// Types
import { TNextPageWithLayout, TProduct } from "@/common/types";

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

type TAPTProduct = {
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

type TAPIEdges = { node: TAPTProduct }[];

type TAPTProducts = {
  edges: {
    node: TAPTProduct;
  }[];
};

type TAPIResponse = {
  data?: {
    products: TAPTProducts;
  };
  errors?: TErrors;
};

// Types for component

type TProducts = TProduct[];

type THomeProps = {
  products: TProducts;
};

//Components and Pages
type TControlsProps = {
  product: TProduct;
};

const ProductCardControls = ({ product }: TControlsProps) => {
  const { state: cart, addProduct, remProduct } = useCart();
  // inCart --> in useEffect to avoid hydration errors
  const [inCart, setInCart] = React.useState(false);
  React.useEffect(() => {
    setInCart(product.merchandiseId in cart);
  }, [cart, product.merchandiseId]);

  return (
    <div className={styles.Controls}>
      <CartIncDec product={product} />
      <div className={styles.Controls__add}>
        <span>
          {currency({ price: product.price, code: product.currencyCode })}
        </span>
        {inCart ? (
          <div
            className={styles.Controls__removeButton}
            onClick={() => remProduct(product)}
          >
            <FaTrashAlt />
          </div>
        ) : (
          <div
            className={styles.Controls__addButton}
            onClick={() => addProduct({ ...product, quantity: 1 })}
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
                <li key={product.merchandiseId} className={styles.Product}>
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
                  <ProductCardControls product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              <li>Sorry no products at this time</li>
            </ul>
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
function createProducts(productEdges: TAPIEdges): TProducts {
  let products: TProducts = [];
  if (!productEdges.length) {
    return products;
  }
  products = productEdges.map((apiNode) => {
    const product = apiNode.node;
    return {
      merchandiseId: product.id,
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
