import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { AppContext, WorkingFile } from "../../../contexts/app";
import { createObjectUrl } from "../../../utils/file";
import "./fileUpload.css";
import addImageIcon from '../../../assets/icons/addImageIcon.svg';
import folderOutline from '../../../assets/icons/folder-outline.svg';
import closeBtn from '../../../assets/icons/close-btn.svg';

interface FileUploadProps {
  onOverlayVisibilityChange: (visible: boolean) => void;
}



export const FileUpload: React.FC<FileUploadProps> = ({
  onOverlayVisibilityChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { fileUrls, setFileUrls } = useContext(AppContext);
  const navigate = useNavigate();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const isImage = acceptedFiles.every(
        (file) =>
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/jpeg"
      );
      if (isImage) {
        const objectUrls: WorkingFile[] = [];
        acceptedFiles.forEach((file) => {
          objectUrls.push({ objectUrl: createObjectUrl(file), fileName: file.name })
        });
        console.log(fileUrls);
        setFileUrls(objectUrls);
        setIsOverlayVisible(false);
        onOverlayVisibilityChange(false);
        setIsDragOver(false);
        navigate("/edit", { state: { files: acceptedFiles } });
      } else {
        alert("Please only upload image files (JPG, JPEG and PNG).");
      }
    },
    [onOverlayVisibilityChange, navigate]
  );

  const onDragEnter = useCallback(() => {
    setIsOverlayVisible(true);
    onOverlayVisibilityChange(true);
    setIsDragOver(true);
  }, [onOverlayVisibilityChange]);

  const onDragLeave = useCallback(() => {
    setIsOverlayVisible(false);
    setIsDragOver(false);
  }, [setIsOverlayVisible, setIsDragOver]);

  const {
    getRootProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
  });

  const closeBox = () => {
    onOverlayVisibilityChange(false);
    setIsOverlayVisible(false);
    setIsDragOver(false);
  };


  return (
    <div>
      <div
        {...getRootProps()}
        className={`fileUpload_box flex flex-col justify-center items-center rounded-lg shadow-md ${isDragOver ? "fileUpload_box_active w-1/2 m-auto" : ""
          }`}
        style={{
          position: isDragOver ? "fixed" : "inherit",
          top: isDragOver ? "50%" : "auto",
          left: isDragOver ? "50%" : "auto",
          transform: isDragOver ? "translate(-50%, -50%)" : "none",
          zIndex: isOverlayVisible ? 2 : 1,
        }}
      >
        {isDragOver && (
          <button className="fileUpload_close_btn" onClick={closeBox}>
            <img src={closeBtn} />
          </button>
        )}
        <img
          src={addImageIcon}
          style={{ marginBottom: "40px" }}
        />
        <button
          id="fileBrowserInputBtn"
          className="fileUpload_btn rounded-lg shadow-md"
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          <img src={folderOutline} />
          <span className="fileUpload_btn_text">Browse Files</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => onDrop(Array.from(e.target.files || []))}
        />
        <p className="fileUpload_box_desc text-xl">
          {isDragAccept
            ? "Drop the file here"
            : isDragReject
              ? "File type not accepted."
              : isDragActive
                ? "Drop files here"
                : "Or drag and drop your photos here"}
        </p>
      </div>
      {isOverlayVisible && <div className="overlay" />}
    </div>
  );
};
