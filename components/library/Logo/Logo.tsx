import * as React from "react";
import Link from "next/link";
import styles from "./Logo.module.scss";

function Logo(): JSX.Element {
  return (
    <div className={styles.Logo}>
      <Link href="/">
        <a>French Fromage</a>
      </Link>
    </div>
  );
}

export { Logo };
