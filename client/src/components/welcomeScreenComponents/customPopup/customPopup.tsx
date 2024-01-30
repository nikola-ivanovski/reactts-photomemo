import React from "react";

interface CustomPopupProps {
    message: string;
    onClose: () => void;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({message, onClose}) => {

    return (
        <div className="popup_overlay">
            <div className="popup">
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    )
} 