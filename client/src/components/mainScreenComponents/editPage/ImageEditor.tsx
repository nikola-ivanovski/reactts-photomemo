import { useContext, useEffect, useState } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";
import { AppContext, ImageData, Metadata, WorkingFile } from "../../../contexts/app";

import backupSvg from "../../../assets/icons/backup.svg";
import leftSvg from "../../../assets/icons/left-arrow.svg";
import rightSvg from "../../../assets/icons/right-arrow.svg";

import "./ImageEditor.css";
import { blobToBase64 } from "../../../utils/file";

// @ts-ignore
import p, { IExif, IExifElement, TagValues } from 'piexifjs';
import { ImageEditorActions } from "../../ImageEditorActions/ImageEditorActions";

interface ImageAnnotations {
  imageUrl: string;
  metadata: string;
}

export const ImageEditorPage: React.FC<ImageAnnotations> = () => {
  const [selectedFile, setSelectedFile] = useState<WorkingFile | null>(null);
  const [exifString, setExifString] = useState<WorkingFile | null>(null);
  const { fileUrls, currentImageMeta } = useContext(AppContext);

  function changeSaveIcon() {
    const saveButtonElement = document.querySelector(
      ".FIE_topbar > .FIE_topbar-buttons-wrapper > div > button > span > span"
    );
    if (saveButtonElement) {
      const iconElement = document.createElement("img");
      iconElement.src = backupSvg;
      saveButtonElement.innerHTML = "";
      saveButtonElement.appendChild(iconElement);
    }
  };

  useEffect(() => {
    if (fileUrls?.length) {
      setSelectedFile(fileUrls[0]);
    }
    changeSaveIcon()
  }, [fileUrls]);

  const onBeforeSave = () => {
    fetch(selectedFile?.objectUrl || "")
      .then(r => r.blob())
      .then((blob) => blobToBase64(blob))
      .then((data: string) => {
        const oldMeta = p.load(data) as Metadata;        
        const newMeta: Metadata = currentImageMeta;
        const resultMeta: Metadata = {
          "0th": {
            ...oldMeta["0th"],
            ...newMeta["0th"]
          },
          "Exif": {
            ...oldMeta["Exif"],
            ...newMeta["Exif"]
          },
          "GPS": {
            ...oldMeta["GPS"],
            ...newMeta["GPS"]
          }
        }
console.log(oldMeta);

        setExifString(p.dump(resultMeta))
      });
  }

  const onSave = (imageObject: ImageData) => {
    fetch(selectedFile?.objectUrl || "").then(r => r.blob()).then((blob) => blob.text()).then((data: string) => {
      console.log(typeof data);

      const meta = p.load(data);
      console.log(meta);
    });

    const dataWithMeta = p.insert(exifString, imageObject.imageBase64);

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = dataWithMeta;
    downloadLink.target = "_self";
    downloadLink.download = imageObject.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  const next = () => {
    let currentIndex = 0;
    if (selectedFile) {
      currentIndex = fileUrls.indexOf(selectedFile);
    }
    if (currentIndex + 1 < fileUrls.length) {
      setSelectedFile(fileUrls[currentIndex + 1]);
    }
  };
  const prev = () => {
    let currentIndex = 0;
    if (selectedFile) {
      currentIndex = fileUrls.indexOf(selectedFile);
    }
    if (currentIndex - 1 >= 0) {
      setSelectedFile(fileUrls[currentIndex - 1]);
    }
  };

  return (
    <>
      <div className="logo_section flex justify-center items-center p-4">
        <img src="/public/images/PhotoMemo_logo1.png" />
      </div>

      <ImageEditorActions />

      {selectedFile && (
        <FilerobotImageEditor
          source={selectedFile.objectUrl}
          onBeforeSave={onBeforeSave}
          onSave={(editedImageObject, _) => onSave(editedImageObject)}
          annotationsCommon={{ fill: undefined }}
          Text={{ text: "Text..." }}
          Rotate={{ angle: 90, componentType: "slider" }}
          Crop={{
            presetsItems: [
              {
                titleKey: "classicTv",
                descriptionKey: "4:3",
                ratio: 4 / 3,
              },
              {
                titleKey: "cinemascope",
                descriptionKey: "21:9",
                ratio: 21 / 9,
              },
            ],
          }}
          tabsIds={[
            TABS.ADJUST,
            TABS.ANNOTATE,
            TABS.FILTERS,
            TABS.FINETUNE,
            TABS.RESIZE,
            TABS.WATERMARK,
          ]}
          defaultTabId={TABS.ANNOTATE}
          defaultToolId={TOOLS.TEXT}
          savingPixelRatio={0}
          previewPixelRatio={0}
        />
      )}
      <div className="carousel p-3 flex justify-center items-center flex-col">
        <div className="navigation flex justify-center items-center gap-10">
          <button onClick={prev}>
            <img src={leftSvg} />
          </button>
          <div className="text-white">{selectedFile?.fileName}</div>
          <button onClick={next}>
            <img src={rightSvg} />
          </button>
        </div>
        <div className="carousel-img flex justify-center items-center gap-2 p-3 overflow-x-scroll">
          {fileUrls.map((file) => {
            const isActive = file === selectedFile;
            return (
              <div
                className={`relative ${isActive ? "border-4 border-blue-500 rounded-xl" : ""
                  }`}
                onClick={() => setSelectedFile(file)}
              >
                <img
                  src={file.objectUrl}
                  className="h-36 rounded-xl"
                />
                {!isActive && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-xl"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
