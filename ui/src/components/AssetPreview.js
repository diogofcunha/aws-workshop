import React, { useCallback } from "react";
import VideoIcon from "./VideoIcon";

const AssetPreview = ({ asset, onSelect, size }) => {
  const { url } = asset;
  const onSelectCb = useCallback(() => {
    onSelect(asset.id);
  }, [asset.id, onSelect]);

  return (
    <div style={{ margin: 10, position: "relative" }}>
      {asset.type === "image" ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img src={url} width={size} onClick={onSelectCb} />
      ) : (
        <React.Fragment>
          <video src={url} width={size} />
          <div
            onClick={onSelectCb}
            style={{
              display: "flex",
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0
            }}
          >
            <VideoIcon size={20} color="black" />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default AssetPreview;
