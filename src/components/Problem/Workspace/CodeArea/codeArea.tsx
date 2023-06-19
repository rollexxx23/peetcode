import React, { useState } from "react";
import PreferenceNav from "./prefNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import cppHeader, { Problem } from "@/utils/models/problem";
import { BsChevronUp } from "react-icons/bs";
import { toast } from "react-toastify";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";
import { problems } from "@/utils/problems/export";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import makeAPIRequests from "@/utils/api/submit/cppSubmit";
type CodeAreaProps = {
  problemProps: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

const CodeArea: React.FC<CodeAreaProps> = ({
  problemProps,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);

  let [userCode, setUserCode] = useState<string>(problemProps.starterCodeJS);
  const [user] = useAuthState(auth);
  let [userLang, setUserLang] = useState<string>("JavaScript");
  const {
    query: { pid },
  } = useRouter();
  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    if (userLang === "JavaScript") {
      jsChecker(user);
    } else if (userLang === "cpp") {
      cppChecker(user);
    }
  };
  const jsChecker = async (user: { uid: string }) => {
    try {
      userCode = userCode.slice(
        userCode.indexOf(problemProps.starterFunctionName)
      );
      const cb = new Function(`return ${userCode}`)();
      const handler = problems[pid as string].handlerFunction;

      if (typeof handler === "function") {
        const success = handler(cb);
        if (success) {
          toast.success("Congrats! All tests passed!", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4000);

          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          });
          setSolved(true);
        }
      }
    } catch (error: any) {
      console.log(error.message);
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Oops! One or more test cases failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
  };

  const cppChecker = async (user: { uid: string }) => {
    const code = cppHeader + userCode + problemProps.cppChecker;
    console.log(code);
    let result = await makeAPIRequests(code);
    console.log("result----->", result);
    if (result) {
      toast.success("Congrats! All tests passed!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 4000);

      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        solvedProblems: arrayUnion(pid),
      });
      setSolved(true);
    } else {
      toast.error("Oops! One or more test cases failed", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };
  const onChange = (value: string) => {
    setUserCode(value);
  };

  return (
    <div className="flex flex-col relative overflow-x-hidden">
      <PreferenceNav
        setUserLang={setUserLang}
        userLang={userLang}
        problemProps={problemProps}
        setUserCode={setUserCode}
      />

      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[70, 30]}
        minSize={0}
      >
        <div className="w-full overflow-auto bg-black">
          <CodeMirror
            theme={vscodeDark}
            extensions={userLang === "JavaScript" ? [javascript()] : [cpp()]}
            onChange={onChange}
            value={
              userLang === "JavaScript"
                ? problemProps.starterCodeJS
                : userLang === "cpp"
                ? problemProps.starterCodeCPP
                : problemProps.starterCodeGO
            }
          />
        </div>

        <div className="w-full px-5 overflow-auto bg-white">
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-gray-800">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-gray-800" />
            </div>
          </div>

          <div className="flex">
            {problemProps.examples.map((example, index) => (
              <div
                className="mr-2 items-start mt-2 "
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex ${
                      activeTestCaseId === index ? "bg-gray-300" : "bg-gray-100"
                    } hover:bg-gray-200 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-gray-800" : "text-gray-500"}
									`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4">
            <div className="text-sm font-medium mt-4 text-gray-800">Input:</div>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-white border-gray-300 text-gray-500 mt-2 text-sm">
              {problemProps.examples[activeTestCaseId].inputText}
            </div>
            <div className="text-sm font-medium mt-4 text-gray-800">
              Output:
            </div>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-white border-gray-300 text-gray-500 mt-2 text-sm">
              {problemProps.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <div className="flex bg-gray-100 absolute bottom-0 z-10 w-full">
        <div className="mx-5 my-[10px] flex justify-between w-full">
          <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
            <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-gray-300 text-sm hover:bg-gray-200 text-gray-700 rounded-lg pl-3 pr-2">
              Console
              <div className="ml-1 transform transition flex items-center">
                <BsChevronUp className="fill-gray-600 mx-1 fill-gray-600" />
              </div>
            </button>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-gray-100 bg-green-500 hover:bg-green-300 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeArea;
