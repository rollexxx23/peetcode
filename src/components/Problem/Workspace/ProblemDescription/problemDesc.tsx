import { auth, firestore } from "@/firebase/firebase";
import { Problem, ProblemFirebase } from "@/utils/models/problem";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStar, TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";

type ProblemDescriptionProps = { problemProps: Problem; _solved: boolean };

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problemProps,
  _solved,
}) => {
  const { currentProblem, loadingDetails, setCurrentProblem, setLoading } =
    useGetCurrentProblem(problemProps.id);
  const { liked, disliked, solved, setData, starred } =
    useGetUsersDataOnProblem(problemProps.id);
  const [user] = useAuthState(auth);
  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    } else {
      setLoading(true);
      await runTransaction(firestore, async (transaction) => {
        const problemRef = doc(firestore, "problems", problemProps.id);
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await transaction.get(userRef);
        const problemDoc = await transaction.get(problemRef);
        if (userDoc.exists() && problemDoc.exists()) {
          const userLikedProblems = userDoc.data().likedProblems;
          const problemLikes = problemDoc.data().likes;

          if (liked) {
            transaction.update(userRef, {
              likedProblems: userDoc
                .data()
                .likedProblems.filter((id: string) => id !== problemProps.id),
            });
            transaction.update(problemRef, {
              likes: problemDoc.data().likes - 1,
            });

            setCurrentProblem((prev) =>
              prev ? { ...prev, likes: prev.likes - 1 } : null
            );
            setData((prev) => ({ ...prev, liked: false }));
          } else if (disliked) {
            transaction.update(userRef, {
              likedProblems: [...userDoc.data().likedProblems, problemProps.id],
              dislikedProblems: userDoc
                .data()
                .dislikedProblems.filter(
                  (id: string) => id !== problemProps.id
                ),
            });
            transaction.update(problemRef, {
              likes: problemDoc.data().likes + 1,
              dislikes: problemDoc.data().dislikes - 1,
            });

            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    likes: prev.likes + 1,
                    dislikes: prev.dislikes - 1,
                  }
                : null
            );
            setData((prev) => ({ ...prev, liked: true, disliked: false }));
          } else {
            const updatedUserLikedProblems = [
              ...userLikedProblems,
              problemProps.id,
            ];
            const updatedProblemLikes = problemLikes + 1;

            transaction.update(userRef, {
              likedProblems: updatedUserLikedProblems,
            });
            transaction.update(problemRef, { likes: updatedProblemLikes });

            setCurrentProblem((prev) =>
              prev ? { ...prev, likes: prev.likes + 1 } : null
            );
            setData((prev) => ({ ...prev, liked: true }));
          }
        }
      });
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    } else {
      setLoading(true);
      await runTransaction(firestore, async (transaction) => {
        const problemRef = doc(firestore, "problems", problemProps.id);
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await transaction.get(userRef);
        const problemDoc = await transaction.get(problemRef);
        if (userDoc.exists() && problemDoc.exists()) {
          const userLikedProblems = userDoc.data().likedProblems;
          const problemLikes = problemDoc.data().likes;

          if (disliked) {
            transaction.update(userRef, {
              dislikedProblems: userDoc
                .data()
                .dislikedProblems.filter(
                  (id: string) => id !== problemProps.id
                ),
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes - 1,
            });
            setCurrentProblem((prev) =>
              prev ? { ...prev, dislikes: prev.dislikes - 1 } : null
            );
            setData((prev) => ({ ...prev, disliked: false }));
          } else if (liked) {
            transaction.update(userRef, {
              dislikedProblems: [
                ...userDoc.data().dislikedProblems,
                problemProps.id,
              ],
              likedProblems: userDoc
                .data()
                .likedProblems.filter((id: string) => id !== problemProps.id),
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes + 1,
              likes: problemDoc.data().likes - 1,
            });
            setCurrentProblem((prev) =>
              prev
                ? {
                    ...prev,
                    dislikes: prev.dislikes + 1,
                    likes: prev.likes - 1,
                  }
                : null
            );
            setData((prev) => ({ ...prev, disliked: true, liked: false }));
          } else {
            transaction.update(userRef, {
              dislikedProblems: [
                ...userDoc.data().dislikedProblems,
                problemProps.id,
              ],
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes + 1,
            });
            setCurrentProblem((prev) =>
              prev ? { ...prev, dislikes: prev.dislikes + 1 } : null
            );
            setData((prev) => ({ ...prev, disliked: true }));
          }
        }
      });
      setLoading(false);
    }
  };

  const handleStar = async () => {
    if (!user) {
      toast.error("You must be logged in to star a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    if (!starred) {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        starredProblems: arrayUnion(problemProps.id),
      });
      setData((prev) => ({ ...prev, starred: true }));
    } else {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        starredProblems: arrayRemove(problemProps.id),
      });
      setData((prev) => ({ ...prev, starred: false }));
    }

    setLoading(false);
  };

  return (
    <div className="bg-white">
      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-black font-medium">
                {problemProps.title}
              </div>
            </div>
            {!loadingDetails && (
              <div className="flex items-center mt-3">
                <div
                  className={` inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize ${
                    currentProblem?.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : currentProblem?.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentProblem?.difficulty}
                </div>
                <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-800">
                  {(solved || _solved) && <BsCheck2Circle />}
                </div>
                <div className="flex items-center cursor-pointer hover:bg-grey-300 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6">
                  <AiFillLike
                    onClick={handleLike}
                    className={`${liked ? "text-blue-700" : ""}`}
                  />
                  <span className="text-xs">{currentProblem?.likes}</span>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-gray-100 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6">
                  <AiFillDislike
                    onClick={handleDislike}
                    className={`${disliked ? "text-red-700" : ""}`}
                  />
                  <span className="text-xs">{currentProblem?.dislikes}</span>
                </div>
                <div className="cursor-pointer hover:bg-gray-100  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 ">
                  {!starred ? (
                    <TiStarOutline onClick={handleStar} />
                  ) : (
                    <TiStar onClick={handleStar} className="text-yellow-700" />
                  )}
                </div>
              </div>
            )}
            {loadingDetails && (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )}
            <div className="text-black">
              <div
                dangerouslySetInnerHTML={{
                  __html: problemProps.problemStatement,
                }}
              />
            </div>

            <div className="mt-4">
              {problemProps.examples.map((example, index) => (
                <div key={example.id}>
                  <div className="font-medium text-black text-sm ">
                    Example {index + 1}:{" "}
                  </div>
                  {example.img && (
                    <img src={example.img} alt="" className="mt-3" />
                  )}
                  <div className="example-card">
                    <pre>
                      <strong className="text-black">Input: </strong>{" "}
                      {example.inputText}
                      <br />
                      <strong>Output:</strong>
                      {example.outputText} <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-5">
              <div className="text-black text-sm font-bold mb-2">
                Constraints:
              </div>
              <ul className="text-black ml-5 list-disc">
                <div
                  dangerouslySetInnerHTML={{ __html: problemProps.constraints }}
                />
              </ul>
            </div>
            <div className="my-10 border-t border-gray-300"></div>
            <div className="flex items-center my-5">
              <p className="text-sm font-bold mr-2">Accepted</p>
              <p className="text-sm mr-4">17K</p>
              <p className="mr-2 text-sm font-bold">Submissions</p>
              <p className="mr-4 text-sm">35K</p>
              <p className="text-sm font-bold mr-2">Acceptance Rate</p>
              <p className="ml-1 text-sm">48.4%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;

function useGetCurrentProblem(problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<ProblemFirebase | null>(
    null
  );
  const [loadingDetails, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get problem from DB
    const getCurrentProblem = async () => {
      console.log(problemId);
      setLoading(true);
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const problem = docSnap.data();
        console.log("problem->", problem);
        setCurrentProblem({ id: docSnap.id, ...problem } as ProblemFirebase);
      }
      setLoading(false);
    };
    getCurrentProblem();
  }, [problemId]);

  return { currentProblem, loadingDetails, setCurrentProblem, setLoading };
}

function useGetUsersDataOnProblem(problemId: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUsersDataOnProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const {
          solvedProblems,
          likedProblems,
          dislikedProblems,
          starredProblems,
        } = data;
        setData({
          liked: likedProblems.includes(problemId),
          disliked: dislikedProblems.includes(problemId),
          starred: starredProblems.includes(problemId),
          solved: solvedProblems.includes(problemId),
        });
      }
    };

    if (user) getUsersDataOnProblem();
    return () =>
      setData({ liked: false, disliked: false, starred: false, solved: false });
  }, [problemId, user]);

  return { ...data, setData };
}

// skeleton component
const RectangleSkeleton: React.FC = () => {
  return (
    <div className="space-y-2.5 animate-pulse">
      <div className="flex items-center w-full space-x-2">
        <div className="h-6 w-12 rounded-full bg-gray-100"></div>
      </div>
    </div>
  );
};

const CircleSkeleton: React.FC = () => {
  return (
    <div className="space-y-2.5 animate-pulse max-w-lg">
      <div className="flex items-center w-full space-x-2">
        <div className="w-6 h-6 rounded-full bg-gray-100"></div>
      </div>
    </div>
  );
};
