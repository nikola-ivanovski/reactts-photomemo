import { createContext } from "react";

export interface ImageData {
    name: string;
    extension: string;
    mimeType: string;
    fullName?: string;
    height?: number;
    width?: number;
    imageBase64?: string;
    imageCanvas?: HTMLCanvasElement;
    quality?: number;
    cloudimageUrl?: string;
  }

export interface WorkingFile {
    objectUrl: string;
    fileName: string;
  }

export interface Metadata {
    "0th": { [key: number]: string };
    "Exif": { [key: number]: string };
    "GPS": { [key: number]: string };
}

interface ContextType {
    fileUrls: WorkingFile[];
    setFileUrls: Function;
    currentImageMeta: Metadata;
    setCurrentImageMeta: Function;
}

const INITIAL_DATA = {
    fileUrls: [],
    setFileUrls: () => { },
    currentImageMeta: {
        "0th": {},
        "Exif": {},
        "GPS": {}
    },
    setCurrentImageMeta: () => { }
}

export const AppContext = createContext<ContextType>(INITIAL_DATA);