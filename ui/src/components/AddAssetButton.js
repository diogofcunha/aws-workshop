import React from "react";
import PlusIcon from "./PlusIcon";

export default function AddAssetButton({ onClick, children }) {
  return (
    <button
      style={{
        borderRadius: "50%",
        backgroundColor: "black",
        width: 70,
        height: 70
      }}
      onClick={onClick}
    >
      {children}
      <PlusIcon />
    </button>
  );
}
