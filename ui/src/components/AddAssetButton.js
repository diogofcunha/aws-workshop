import React from "react";
import PlusIcon from "./PlusIcon";

export default function AddAssetButton({ onClick }) {
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
      <PlusIcon />
    </button>
  );
}
