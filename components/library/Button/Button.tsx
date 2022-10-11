import * as React from "react";
import { COLORS } from "@/common/constants";
import styles from "./Button.module.scss";

type TBProps = {
  border?: string;
  backgroundColor?: string;
  color?: string;
  children?: React.ReactNode;
  height?: string;
  clickHandler?: () => void;
  radius?: string;
  width?: string;
  padding?: string;
  type: `button` | `reset` | `submit` | undefined;
};

function Button({
  border = `none`,
  backgroundColor = COLORS[`cheese`],
  color = COLORS[`chocolate`],
  children,
  height = `auto`,
  clickHandler,
  radius = `0`,
  width = `auto`,
  padding = `1rem 2rem`,
  type = `button`,
}: TBProps): JSX.Element {
  return clickHandler ? (
    <button
      className={styles.Button}
      onClick={clickHandler}
      style={{
        border,
        color,
        backgroundColor,
        borderRadius: radius,
        height,
        width,
        padding,
      }}
      type={type}
    >
      {children}
    </button>
  ) : (
    <button
      className={styles.Button}
      style={{
        border,
        color,
        backgroundColor,
        borderRadius: radius,
        height,
        width,
        padding,
      }}
      type={type}
    >
      {children}
    </button>
  );
}

export { Button };
