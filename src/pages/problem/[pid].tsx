import React, { useEffect, useState } from "react";
import Topbar from "@/components/Home/topbar";
import WorkSpace from "@/components/Problem/Workspace/workspace";
import { Problem } from "@/utils/models/problem";
import { problems } from "@/utils/problems/export";
type ProblemPageProps = {
  problem: Problem;
};

export default function ProblemPage({ problem }: ProblemPageProps) {
  return (
    <>
      <main className="bg-white  min-h-screen">
        <Topbar problemPage />
        <WorkSpace problem={problem} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = Object.keys(problems).map((key) => ({
    params: { pid: key },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const problem = problems[pid];

  if (!problem) {
    return {
      notFound: true,
    };
  }
  problem.handlerFunction = problem.handlerFunction.toString();
  return {
    props: {
      problem,
    },
  };
}
