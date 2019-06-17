import React, { useEffect, useState } from "react";
import { getImages } from "./client";
import AssetInfoOverlay from "./components/AssetInfoOverlay";
import AssetGrid from "./components/AssetGrid";
import DropzoneContainer from "./components/DropContainer";

function App() {
  const [assets, setAssets] = useState(undefined);
  const [selectedAsset, setSelectedAsset] = useState(undefined);

  useEffect(() => {
    async function fetchImages() {
      const images = await getImages();
      setAssets(images || null);
    }

    fetchImages();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <DropzoneContainer>
        {assets === undefined ? (
          "Loading"
        ) : assets && assets.length ? (
          <div>
            <AssetGrid assets={assets} setSelectedAsset={setSelectedAsset} />
            {selectedAsset && (
              <AssetInfoOverlay
                id={selectedAsset}
                onClose={() => setSelectedAsset(undefined)}
              />
            )}
          </div>
        ) : (
          "No assets"
        )}
      </DropzoneContainer>
    </div>
  );
}
export default App;
