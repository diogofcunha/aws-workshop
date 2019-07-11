import spawnBuffered from "./spawnBuffered";

const videoFlags = [
  "-f",
  "mp4",
  "-codec:v",
  "libx264",
  "-preset",
  "superfast",
  "-movflags",
  "frag_keyframe+empty_moov"
];

const imageFlags = ["-f", "image2", "-codec:v", "mjpeg"];

export const processThumbnail = async (input, isVideo) => {
  const ffmpegArgs = [
    "-i",
    input,
    ...(isVideo ? [] : ["-frames:v", "1"]),
    "-q:v",
    `3`,
    ...(isVideo ? videoFlags : imageFlags),
    "-"
  ];

  return await spawnBuffered("ffmpeg", ffmpegArgs);
};

export const getInfo = async input => {
  const ffprobeArgs = [
    "-show_streams",
    "-select_streams",
    "v",
    "-print_format",
    "json",
    "-show_frames",
    "-show_format",
    "-read_intervals",
    "%+#1"
  ];

  const rawData = await spawnBuffered(
    "ffprobe",
    ["-i", input].concat(ffprobeArgs)
  );

  return normalizeInfoData(JSON.parse(rawData.toString()));
};

const normalizeInfoData = rawData => {
  const { frames, format, streams } = rawData;
  const assetData =
    frames[0] ||
    (streams && streams.find(s => s.height != null && s.width != null));

  let durationInSeconds = parseFloat(format.duration || "0");

  let { width, height } = assetData;
  let orientation = 1;

  if (assetData.tags && assetData.tags.Orientation) {
    orientation = parseInt(assetData.tags.Orientation, 10);
  }

  return {
    durationInSeconds,
    width,
    height,
    orientation
  };
};
