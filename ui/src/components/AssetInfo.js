import React from "react";

import "./AssetInfo.css";

const AssetInfo = ({ info }) => {
  return (
    <table className="asset-info">
      <tbody>
        <tr>
          <td>Taken at:</td>
          <td>{new Date(info.addedAt).toLocaleString()}</td>
        </tr>
        <tr>
          <td>Resolution:</td>
          <td>
            {info.width}x{info.height}
          </td>
        </tr>
        {info.durationInSeconds > 0 && (
          <tr>
            <td>Duration:</td>
            <td>{info.durationInSeconds} seconds</td>
          </tr>
        )}
        <tr>
          <td>Format:</td>
          <td>{info.mimeType.split("/")[1]}</td>
        </tr>
        <tr>
          <td>Mime type:</td>
          <td>{info.mimeType}</td>
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
