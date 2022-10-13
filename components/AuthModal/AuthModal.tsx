import * as React from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

import NiceModal, { useModal } from "@ebay/nice-modal-react";

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
      form = <RegisterForm />;
      break;
    case `reset-password`:
      form = <ResetPasswordForm />;
      break;
    default:
      throw new Error(`modal Type of ${modalType} is not valid`);
  }
  return (
    <Dialog isOpen={modal.visible}>
      <div>
        <h2>{modalType.replace(`-`, ` `)}</h2>
        <button onClick={() => modal.hide()}>X</button>
        <div>{form}</div>
      </div>
    </Dialog>
  );
});

const showAuthModal = (modalType: TAuthModalType) => {
  NiceModal.show(AuthModal, { modalType });
};

export { showAuthModal };

// dummy Modal forms

function LoginForm() {
  return <div>Login Form</div>;
}
function RegisterForm() {
  return <div>Register Form</div>;
}
function ResetPasswordForm() {
  return <div>Reset Password Form</div>;
}
