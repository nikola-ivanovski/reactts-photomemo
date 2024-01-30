import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { AppContext, WorkingFile } from "../../../contexts/app";
import axios from "axios";
import { createObjectUrl } from "../../../utils/file";
import "./fileUpload.css";

interface FileUploadProps {
  onOverlayVisibilityChange: (visible: boolean) => void;
}



export const FileUpload: React.FC<FileUploadProps> = ({
  onOverlayVisibilityChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { fileUrls, setFileUrls } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('https://localhost:3001/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

    } catch (error) {
      console.error('Error uploading file: ', error);

    }
  }

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
        console.log(objectUrls);
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
    // getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    // acceptedFiles,
  } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
  });

  // const openFileBrowser = () => {
  //   if (inputRef.current) {
  //     inputRef.current.click();
  //   }
  // };

  const closeBox = () => {
    onOverlayVisibilityChange(false);
    setIsOverlayVisible(false);
    setIsDragOver(false);
  };

  // OPTIONAL -> IF POPUP MODAL NEEDED FOR DIFFERENT FILE UPLOAD
  // const openPopup = (message: string) => {
  //     setPopupMessage(message);
  // };

  // const closePopup = () => {
  //     setPopupMessage(null);
  // };

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
            <img src="/client/src/assets/icons/closeBtn.svg" />
          </button>
        )}
        <img
          src="src/assets/icons/addImageIcon.svg"
          style={{ marginBottom: "40px" }}
        />
        <button
          id="fileBrowserInputBtn"
          className="fileUpload_btn rounded-lg shadow-md"
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          <img src="/client/src/assets/icons/folder-outline.svg" />
          <span className="fileUpload_btn_text">Browse Files</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => onDrop(Array.from(e.target.files || []))}
          // onChange={handleFileChange}
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
      {/* OPTIONAL -> IF POPUP MODAL NEEDED FOR DIFFERENT FILE UPLOAD */}
      {/* {popupMessage && (
                <CustomPopup message={popupMessage} onClose={closePopup} />
            )} */}
    </div>
  );
};
