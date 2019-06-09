import React from "react";

const VideoIcon = ({ size, color }) => (
  <div
    style={{
      width: 0,
      height: 0,
      borderTop: `${size}px solid transparent`,
      borderBottom: `${size}px solid transparent`,
      borderLeft: `${size}px solid ${color}`
    }}
  />
);

export default VideoIcon;
