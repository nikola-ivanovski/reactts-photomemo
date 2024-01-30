import { useState } from 'react';
import { FileUpload } from '../../components/welcomeScreenComponents/fileUpload/fileUpload';
import './welcomeScreen.css'

export const WelcomeScreen = () => {
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const handleOverlayVisibility = (visible: boolean) => {
        setOverlayVisible(visible);
    }

    return (
        <div className="container mx-auto flex flex-col h-screen">
            <div className="heading_section m-auto w-1/2">
                <h1 className='text-6xl text-center'>Effortless Photo Annonations</h1>
                <p className='text-xl text-center'>Let PhotoMemo auto-tag the specifics of your snapshots.<br/>
                Fine-tune with your notes and treasure your moments.</p>
            </div>
            <div className="fileUploadSection m-auto w-1/2">
                <FileUpload onOverlayVisibilityChange = {handleOverlayVisibility} />
                {isOverlayVisible && <div className='overlay' />}
            </div>
        </div>
    )
}