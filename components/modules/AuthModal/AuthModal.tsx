import * as React from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { SignupForm } from "@/components/forms/SignupForm";
import styles from "./AuthModal.module.scss";
import { LoginForm } from "@/components/forms/LoginForm";

type TAuthModalType = `login` | `sign-up` | `reset-password`;

type TAuthModalProps = {
  modalType: TAuthModalType;
};

const AuthModal = NiceModal.create(({ modalType }: TAuthModalProps) => {
  const modal = useModal();
  let form: JSX.Element;
  switch (modalType) {
    case `login`:
      form = <LoginForm />;
      break;
    case `sign-up`:
      form = <SignupForm locale="en" />;
      break;
    case `reset-password`:
      form = <ResetPasswordForm />;
      break;
    default:
      throw new Error(`modal Type of ${modalType} is not valid`);
  }
  return (
    <Dialog className={styles.AuthModal} isOpen={modal.visible}>
      <header className={styles.AuthModal__header}>
        <h2>{modalType.replace(`-`, ` `)}</h2>
        <button onClick={() => modal.hide()}>X</button>
      </header>
      <div className={styles.AuthModal__body}>{form}</div>
    </Dialog>
  );
});

const showAuthModal = (modalType: TAuthModalType) => {
  NiceModal.show(AuthModal, { modalType });
};

export { showAuthModal };

// dummy Modal forms

function ResetPasswordForm() {
  return <div>Reset Password Form</div>;
}
