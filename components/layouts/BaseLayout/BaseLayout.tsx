import Head from "next/head";
import { CartProvider } from "@/common/contexts/cartContext";
import { AuthProvider } from "@/common/contexts/authContext";
import { SITE_CONFIG } from "@/common/constants";

type TBaseLayout = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: TBaseLayout): JSX.Element => {
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="icon" href="/cheese.png" />
      </Head>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </>
  );
};

export { BaseLayout };
