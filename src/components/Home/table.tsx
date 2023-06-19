import { firestore } from "@/firebase/firebase";
import { ProblemFirebase } from "@/utils/models/problem";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type TableProps = {
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const premium_bought = false;

const TableComponent: React.FC<TableProps> = ({ setLoadingProblems }) => {
  const data = useGetProblems(setLoadingProblems);
  return (
    <>
      <table className="min-w-full bg-white ">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {true ? <span className="text-green-500">✔</span> : ""}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <Link href={"problem/" + row.id}>{row.title}</Link>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium leading-4 ${
                    row.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : row.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {row.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {premium_bought ? (
                  row.companies.join(", ")
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a2 2 0 100 4 2 2 0 000-4zM4 6a2 2 0 100 4 2 2 0 000-4zM10 6a2 2 0 100 4 2 2 0 000-4zM16 6a2 2 0 100 4 2 2 0 000-4zM4 10a2 2 0 100 4 2 2 0 000-4zM10 10a2 2 0 100 4 2 2 0 000-4zM16 10a2 2 0 100 4 2 2 0 000-4zM4 14a2 2 0 100 4 2 2 0 000-4zM10 14a2 2 0 100 4 2 2 0 000-4zM16 14a2 2 0 100 4 2 2 0 000-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-500">Locked</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableComponent;

function useGetProblems(
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [problems, setProblems] = useState<ProblemFirebase[]>([]);

  useEffect(() => {
    const getProblems = async () => {
      // fetching data logic
      setLoadingProblems(true);
      const q = query(
        collection(firestore, "problems"),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      const tmp: ProblemFirebase[] = [];
      querySnapshot.forEach((doc) => {
        tmp.push({ id: doc.id, ...doc.data() } as ProblemFirebase);
      });
      setProblems(tmp);
      setLoadingProblems(false);
    };

    getProblems();
  }, [setLoadingProblems]);
  return problems;
}
