import * as React from "react";
import Head from "next/head";

import { BaseLayout } from "@/components/layouts/BaseLayout/BaseLayout";
import { FrontLayout } from "@/components/layouts/FrontLayout";
import { gql } from "@/common/constants";
import { fetchShopifyGQL } from "@/common/utils/api";
import styles from "@/styles/page-styles/Home.module.scss";
import * as colors from "@/common/js_styles/colors";
// Types
import { TNextPageWithLayout } from "@/common/types";

type TProduct = {
  id: string;
  title: string;
};

type TProducts = {
  edges: {
    node: TProduct;
  }[];
};

type THomeProps = {
  products: TProducts | Record<never, never>;
};
type TErrors = {
  [key: string]: unknown;
}[];

type TResponse = {
  data?: {
    products: TProducts;
  };
  errors?: TErrors;
};

//Components and Pages

const Home: TNextPageWithLayout<THomeProps> = ({ products }): JSX.Element => {
  let productsArr: TProduct[] = [];
  if (`edges` in products) {
    productsArr = products.edges.map((edge) => edge.node);
  }
  return (
    <>
      <Head>
        <title>Shopify Text</title>
        <meta name="description" content="First text of shopfiy with next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.Home}>
        <div className="container">
          <h1>Shopify Next.js Test One</h1>

          {productsArr.length ? (
            <ul>
              {productsArr.map((product) => (
                <li key={product.id}>{product.title}</li>
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
      products(first: 3) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;

  try {
    const { data, errors } = await fetchShopifyGQL<TResponse>({ query });
    console.dir(data, { depth: null });
    console.dir(errors, { depth: null });
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }
    return {
      props: {
        products: data?.products ?? {},
      },
    };
  } catch (error) {
    console.log(`\n=={ Home GetStaticProps }==\n`);
    console.error(error);
  }
}
