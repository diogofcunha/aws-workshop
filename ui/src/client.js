export const saveFile = async () => {
  return true;
};

export const getImages = async () => {
  return [
    {
      id: 1,
      type: "image",
      url: "assets/1.jpg"
    },
    { id: 2, type: "video", url: "assets/2.mp4" },
    { id: 3, type: "image", url: "assets/3.jpg" },
    { id: 4, type: "video", url: "assets/4.mp4" },
    { id: 5, type: "video", url: "assets/5.mp4" },
    { id: 6, type: "video", url: "assets/6.mp4" }
  ];
};

export const getAssetInfo = async id => {
  if (id === 1) {
    return {
      takenAt: Date.now(),
      resolution: "1080x1920",
      format: "JPEG",
      mimeType: "image/jpeg",
      numberOfPixels: "3.22K",
      orientation: "Vertical"
    };
  } else {
    throw new Error("Not found");
  }
};
