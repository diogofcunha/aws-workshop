import React from "react";

import useWindowSize from "../hooks/useWindowSize";
import AssetPreview from "./AssetPreview";

const SIZE = 200;
const MARGIN = 20;

export default function AssetGrid({ assets, setSelectedAsset }) {
  const { width: maxRowSize } = useWindowSize();
  const rows = [[]];
  let currentRowSize = 0;
  let rowIndex = 0;

  assets.forEach(a => {
    if (currentRowSize + SIZE >= maxRowSize) {
      currentRowSize = 0;
      rowIndex++;
      rows[rowIndex] = [];
    }

    currentRowSize += SIZE;
    currentRowSize += MARGIN;
    rows[rowIndex].push(a);
  });

  return (
    <div style={{ overflow: "scroll", height: "100%" }}>
      {rows.map((assets, i) => (
        <div style={{ display: "flex" }} key={i}>
          {assets.map(a => (
            <AssetPreview
              key={a.id}
              asset={a}
              onSelect={setSelectedAsset}
              size={SIZE}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
