import * as React from "react";
import { COLORS } from "@/common/constants";
import styles from "./Button.module.scss";

type TBProps = {
  border?: string;
  backgroundColor?: string;
  color?: string;
  children?: React.ReactNode;
  height?: string;
  clickHandler: () => void;
  radius?: string;
  width?: string;
  padding?: string;
};

function Button({
  border = `none`,
  backgroundColor = COLORS[`aliveVGreen`],
  color = COLORS[`richBlack`],
  children,
  height = `auto`,
  clickHandler,
  radius = `0`,
  width = `auto`,
  padding = `1rem 2rem`,
}: TBProps): JSX.Element {
  return (
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
    >
      {children}
    </button>
  );
}

export { Button };
