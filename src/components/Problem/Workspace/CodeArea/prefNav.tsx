import { Problem } from "@/utils/models/problem";
import { useState, useEffect } from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";

type PreferenceNavProps = {
  setUserLang: React.Dispatch<React.SetStateAction<string>>;
  setUserCode: React.Dispatch<React.SetStateAction<string>>;
  userLang: string;
  problemProps: Problem;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({
  setUserLang,
  userLang,
  setUserCode,
  problemProps,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  const handleChange = (event: { target: { value: any } }) => {
    const selectedLanguage = event.target.value;
    setUserLang(selectedLanguage);
    if (selectedLanguage === "JavaScript") {
      setUserCode(problemProps.starterCodeJS);
    } else if (selectedLanguage === "cpp") {
      setUserCode(problemProps.starterCodeCPP);
    } else {
      setUserCode(problemProps.starterCodeGO);
    }
  };
  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full p-2">
      <div className="flex items-center">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-gray-300 text-gray-700 hover:bg-gray-200 px-2 py-1.5 font-medium">
          <div className="flex items-center px-1">
            <div className="text-xs text-gray-700">
              <select
                className="text-xs text-gray-700"
                defaultValue={userLang}
                value={userLang}
                onChange={handleChange}
              >
                <option value="JavaScript">JavaScript</option>

                <option value="cpp">C++</option>
              </select>
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center m-2">
        <button className="preferenceBtn group">
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="preferenceBtn-tooltip">Settings</div>
        </button>

        <button className="preferenceBtn group" onClick={handleFullScreen}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className="preferenceBtn-tooltip">Full Screen</div>
        </button>
      </div>
    </div>
  );
};
export default PreferenceNav;
