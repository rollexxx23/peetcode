import TableComponent from "@/components/Home/table";
import TopBar from "@/components/Home/topbar";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  return (
    <main className="bg-white  min-h-screen">
      <TopBar problemPage={false} />
      <section className="bg-blue-500 py-1">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl text-center font-semibold text-gray-800">
            Welcome to PeetCode
          </h2>
          <p className="text-lg text-center text-gray-600 mt-2">
            Explore our amazing problems and find solutions...
          </p>
        </div>
      </section>
      <div className="w-full lg:w-4/5 mx-auto">
        {isLoading && (
          <div className="mx-auto w-8/10 w-full animate-pulse">
            {[...Array(10)].map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))}
          </div>
        )}
      </div>
      <div className="w-full lg:w-4/5 mx-auto">
        <TableComponent setLoadingProblems={setLoading} />
      </div>
    </main>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="flex items-center space-x-12 mt-4 px-6">
        <div className="w-6 h-6 shrink-0 rounded-full bg-gray-100"></div>
        <div className="h-4 sm:w-52  w-32  rounded-full bg-gray-100"></div>
        <div className="h-4 sm:w-52  w-32 rounded-full bg-gray-100"></div>
        <div className="h-4 sm:w-52 w-32 rounded-full bg-gray-100"></div>
        <div className="h-4 sm:w-52 w-32 rounded-full bg-gray-100"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
