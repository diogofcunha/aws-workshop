export const saveFile = async file => {
  const res = await fetch(
    `${
      process.env.REACT_APP_API_ORIGIN
    }/upload?content-type=${encodeURIComponent(file.type)}`,
    {
      method: "POST"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save file");
  }

  const presignedPost = await res.json();

  const formData = new FormData();

  Object.keys(presignedPost.fields).forEach(key => {
    formData.append(key, presignedPost.fields[key]);
  });

  formData.append("Content-Type", file.type);
  formData.append("file", file);
  const s3Response = await fetch(presignedPost.url, {
    method: "POST",
    body: formData
  });

  if (!s3Response.ok) {
    throw new Error("Failed to upload to Amazon S3");
  }
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
      addedAt: Date.now(),
      durationInSeconds: 0,
      orientation: 1,
      mimeType: "image/jpeg",
      AssetId: "1",
      width: 1080,
      height: 1920
    };
  } else {
    throw new Error("Not found");
  }
};
