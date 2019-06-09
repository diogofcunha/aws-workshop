import { useEffect } from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

export default function Overlay({ children }) {
  const el = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => modalRoot.removeChild(el);
  });

  return ReactDOM.createPortal(children, el);
}
