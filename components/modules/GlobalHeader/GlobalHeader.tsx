import styles from "./GlobalHeader.module.scss";

type TGHProps = {
  children?: React.ReactNode;
};
function GlobalHeader({ children }: TGHProps): JSX.Element {
  return <header className={styles.Header}>{children}</header>;
}

export { GlobalHeader };
