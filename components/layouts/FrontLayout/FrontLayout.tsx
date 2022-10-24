import Head from "next/head";
import Link from "next/link";

import { SITE_CONFIG } from "@/common/constants";
import { Logo } from "@/components/library/Logo";
import { GlobalHeader } from "@/components/modules/GlobalHeader";
import { showAuthModal } from "@/components/modules/AuthModal";
import { useAuth } from "@/common/contexts/authContext";
import styles from "./FrontLayout.module.scss";

type TFLProps = {
  children: React.ReactNode;
};
const FrontLayout = ({ children }: TFLProps): JSX.Element => {
  const { isAuthorized, logoutCustomer } = useAuth();
  console.log(`Is Authorized -->`, isAuthorized);
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="icon" href="/cheese.png" />
      </Head>
      <GlobalHeader>
        <Logo />

        <div className={styles.RightMenu}>
          <Link href="/cart">
            <a>Cart</a>
          </Link>
          <Link href="/checkout">
            <a>Checkout</a>
          </Link>
          {isAuthorized ? (
            <button onClick={() => logoutCustomer()}>Logout</button>
          ) : (
            <button onClick={() => showAuthModal(`login`)}>Login</button>
          )}
          <button onClick={() => showAuthModal(`sign-up`)}>Sign Up</button>
        </div>
      </GlobalHeader>
      {children}
    </>
  );
};

export { FrontLayout };
