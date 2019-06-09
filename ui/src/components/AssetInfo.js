import React from "react";

import "./AssetInfo.css";

const AssetInfo = ({ info }) => {
  return (
    <table className="asset-info">
      <tbody>
        <tr>
          <td>Taken at:</td>
          <td>{new Date(info.takenAt).toLocaleString()}</td>
        </tr>
        <tr>
          <td>Resolution:</td>
          <td>{info.resolution}</td>
        </tr>
        <tr>
          <td>Format:</td>
          <td>{info.format}</td>
        </tr>
        <tr>
          <td>Mime type:</td>
          <td>{info.mimeType}</td>
        </tr>
        <tr>
          <td>Number of pixels:</td>
          <td>{info.numberOfPixels}</td>
        </tr>
        <tr>
          <td>Orientation:</td>
          <td>{info.orientation}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default AssetInfo;
