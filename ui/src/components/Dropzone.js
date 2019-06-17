import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveFile } from "../client";

export default function DropzoneContainer({ children }) {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length) {
      setFilesToUpload(acceptedFiles);

      acceptedFiles.forEach((f, i) => {
        saveFile(f)
          .then(() => {
            setUploadedFiles(files => [...files, true]);
          })
          .catch(() => {
            setUploadedFiles(files => [...files, true]);
          })
          .finally(() => {
            setTimeout(() => {
              setUploadedFiles([]);
              setFilesToUpload([]);
            }, 2000);
          });
      });
    }
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      {filesToUpload.length > 0 && (
        <div>
          Uploading the files {uploadedFiles.length} out of{" "}
          {filesToUpload.length}
        </div>
      )}
      {isDragActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1
          }}
        >
          Drop your files here..
        </div>
      )}
      <div style={{ opacity: isDragActive ? 0.5 : 1 }}>{children}</div>
    </div>
  );
}
