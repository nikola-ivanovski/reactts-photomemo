import { useContext, useEffect, useRef, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './ImageEditorActions.css'

import uploadSvg from "../../assets/icons/upload-btn.svg";
import settingsSvg from "../../assets/icons/settings-wheel.svg";
import { createObjectUrl } from "../../utils/file";
// @ts-ignore
import p from 'piexifjs';
import { AppContext } from "../../contexts/app";

export function ImageEditorActions() {
    const [date, setDate] = useState<Date | null>(null);
    const [lat, setLat] = useState<string>("");
    const [lng, setLng] = useState<string>("");
    const [address, setAddress] = useState<any>("");
    const [description, setDescription] = useState<string | null>(null);

    const { fileUrls, setFileUrls, setCurrentImageMeta } = useContext(AppContext);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const inputActionsRef = useRef<HTMLDivElement | null>(null);

    const onAddImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const onAddImage = (event: any) => {
        const file = event.target.files[0];
        setFileUrls([...fileUrls, {
            objectUrl: createObjectUrl(file),
            name: file.name
        }]);
    }

    const showActions = () => {
        if (inputActionsRef.current) {
            inputActionsRef.current.classList.toggle('active');
        }
    }

    const onDateChange = (date: Date | null) => {
        setDate(date);
    }

    useEffect(() => {
        const reverseGeocode = async (latitude: number, longitude: number) => {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            try {
                const response = await fetch(url);
                return await response.json();
            } catch (error) {
                console.error('Error in reverse geocoding:', error);
                return 'Address not found';
            }
        };

        if (!!lat && !!lng) {
            reverseGeocode(parseFloat(lat), parseFloat(lng)).then((data) => setAddress(data))
        }
    }, [lat, lng]);

    useEffect(() => {
        setCurrentImageMeta({
            "0th": {
                [p.ImageIFD.ImageDescription as number]: description || "",
                [p.ImageIFD.DateTime as number]: date || "",
            },
            "Exif": {
                [p.ExifIFD.DateTimeOriginal as number]: date || "",
            },
            "GPS": {
                [p.GPSIFD.GPSLatitude as number]: address?.lat || "",
                [p.GPSIFD.GPSLongitude as number]: address?.lon || "",
                [p.GPSIFD.GPSAreaInformation as number]: address?.display_name || ""
            },
        })
    }, [date, description, address])

    return (
        <div className="image-editor-actions-wrapper flex justify-center items-start bg-transparent" ref={inputActionsRef}>
            <div className="image-actions-toggle bg-transparent">
                <button className="flex justify-center items-center p-2 w-full" onClick={showActions}>
                    <img src={settingsSvg} />
                </button>
            </div>
            <div className="img-ea-container px-6 py-2 flex flex-col">
                <div className="image-editor-actions">
                    <input type="file" ref={fileInputRef} onChange={(e) => onAddImage(e)} hidden />
                    <button className="flex" onClick={onAddImageClick} title="Add image">
                        <img src={uploadSvg} />
                    </button>
                </div>
                <div className="image-editor-meta-content my-3">
                    <h4 className="my-2 font-bold">Image Details</h4>
                    <div className="my-2 flex flex-col">
                        <label>Image description:</label>
                        <textarea className="rounded-lg" onChange={(event) => setDescription(event.target.value)} rows={3} />
                    </div>
                    <div className="mt-2 mb-4 flex flex-col">
                        <label>Image date and time:</label>
                        <DateTimePicker className="datetime-picker" onChange={onDateChange} value={date} />
                    </div>
                    <h4 className="my-2 font-bold">GPS Coordinates</h4>
                    <div className="my-2 flex flex-col">
                        <label>Latitude:</label>
                        <input className="rounded-lg" onChange={(event) => setLat(event.target.value)} value={lat} />
                    </div>
                    <div className="my-2 flex flex-col">
                        <label>Longitude:</label>
                        <input className="rounded-lg" onChange={(event) => setLng(event.target.value)} value={lng} />
                    </div>
                    {address.display_name && <p>{address.display_name}</p>}
                </div>
            </div>
        </div>
    )
}