import React, { useEffect, useState } from "react";

import Overlay from "./Overlay";
import { getAssetInfo } from "../client";
import AssetInfo from "./AssetInfo";
import CloseIcon from "./CloseIcon";

const AssetInfoOverlay = ({ id, onClose }) => {
  const [assetInfo, setAssetInfo] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const info = await getAssetInfo(id);
        setAssetInfo(info);
      } catch (ex) {
        setAssetInfo(null);
      }
    }

    fetchData();
  }, [id]);

  return (
    <Overlay>
      <div
        style={{
          backgroundColor: "white",
          position: "fixed",
          bottom: 0,
          height: 200,
          width: "100%",
          zIndex: 99999,
          boxSizing: "border-box",
          padding: 15,
          border: "1px solid black"
        }}
      >
        <div>
          <button onClick={onClose} style={{ border: "none" }}>
            <CloseIcon />
          </button>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {assetInfo && <AssetInfo info={assetInfo} />}
          {assetInfo === undefined
            ? "Loading asset info"
            : assetInfo === null
            ? "Failed to load asset info"
            : null}
        </div>
      </div>
    </Overlay>
  );
};

export default AssetInfoOverlay;
