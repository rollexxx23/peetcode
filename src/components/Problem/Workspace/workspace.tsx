import React, { useState } from "react";

import Split from "react-split";
import ProblemDescription from "./ProblemDescription/problemDesc";
import CodeArea from "./CodeArea/codeArea";
import { Problem } from "@/utils/models/problem";
import Confetti from "react-confetti/";

import useWindowSize from "@/utils/screen-size/screenSize";

type WorkSpaceProps = { problem: Problem };

const WorkSpace: React.FC<WorkSpaceProps> = ({ problem }) => {
  const [success, setSuccess] = useState(false);
  const { width, height } = useWindowSize();
  const [solved, setSolved] = useState(false);

  return (
    <Split className="split">
      <ProblemDescription problemProps={problem} _solved={solved} />
      <div>
        <CodeArea
          setSuccess={setSuccess}
          problemProps={problem}
          setSolved={setSolved}
        />
        {success && (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 100}
            height={height - 100}
          />
        )}
      </div>
    </Split>
  );
};

export default WorkSpace;
