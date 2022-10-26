import { FaTrashAlt } from "react-icons/fa";
import styles from "./RemoveProdBtn.module.scss";
import { useCart } from "@/common/contexts/cartContext";
import { TProduct, TProductQ } from "@/common/types";

type TRPBtnProps = {
  product: TProduct | TProductQ;
};

function RemoveProdBtn({ product }: TRPBtnProps) {
  const { remProduct } = useCart();
  return (
    <button className={styles.RemProdBtn} onClick={() => remProduct(product)}>
      <FaTrashAlt />
    </button>
  );
}

export { RemoveProdBtn };
