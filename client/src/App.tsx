import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { WelcomeScreen } from "./screens/welcomeScreen/welcomeScreen";
import { ImageEditorPage } from "./components/mainScreenComponents/editPage/ImageEditor";
import { useState } from "react";
import { AppContext } from "./contexts/app";

function App() {
  const [fileUrls, setFileUrls] = useState([]);
  const [currentImageMeta, setCurrentImageMeta] = useState({
    "0th": {},
    "Exif": {},
    "GPS": {}
});

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppContext.Provider value={{ fileUrls, setFileUrls, currentImageMeta, setCurrentImageMeta }}>
              <WelcomeScreen />
            </AppContext.Provider>
          }
        />
        <Route
          path="/edit/"
          element={
            <AppContext.Provider value={{ fileUrls, setFileUrls, currentImageMeta, setCurrentImageMeta }}>
              <ImageEditorPage />
            </AppContext.Provider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
