import Head from "next/head";

import { SITE_CONFIG } from "@/common/constants";
import { Logo } from "@/components/library/Logo";
import { GlobalHeader } from "@/components/modules/GlobalHeader";
import { showAuthModal } from "@/components/AuthModal";
import styles from "./FrontLayout.module.scss";

type TFLProps = {
  children: React.ReactNode;
};
const FrontLayout = ({ children }: TFLProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="icon" href="/cheese.png" />
      </Head>
      <GlobalHeader>
        <Logo />
        <button onClick={() => showAuthModal(`login`)}>Login</button>
        <button onClick={() => showAuthModal(`sign-up`)}>Sign Up</button>
        <button onClick={() => showAuthModal(`reset-password`)}>
          Reset Password
        </button>
      </GlobalHeader>
      {children}
    </>
  );
};

export { FrontLayout };
