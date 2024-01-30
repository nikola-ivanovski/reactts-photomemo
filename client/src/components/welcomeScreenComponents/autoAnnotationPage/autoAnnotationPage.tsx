import React, { useEffect, useState } from "react";
// import FilerobotImageEditor from "react-filerobot-image-editor";
import { useNavigate, useParams } from 'react-router-dom';

interface AutoAnnotationPageProps {
    uploadedPhotos: File[];
};

export const AutoAnnotationPage: React.FC<AutoAnnotationPageProps> = ({ uploadedPhotos }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);
    const navigate = useNavigate();
    const {fileName} = useParams();

    useEffect(() => {
        const processNextPhoto = async () => {
            if (currentPhotoIndex < uploadedPhotos.length) {
                await new Promise((resolve) => setTimeout(resolve, 2000));

                setCurrentPhotoIndex((prevIndex) => prevIndex + 1);
            } else {
                setIsProcessing(false);
                navigate(`/edit/${fileName}`);
            }
        };
        processNextPhoto();
    }, [currentPhotoIndex, uploadedPhotos, fileName, navigate]);

    return (
        <div>
            {isProcessing ? (
                // Spinner component here
                <p>Loading...</p>
            ) :  (
                <p>All photos processed, redirecting too editing page...</p>
            )}
        </div>
    )
};