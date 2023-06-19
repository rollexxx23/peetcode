import { Example } from "./example";

const cppHeader = `
#include <bits/stdc++.h>

using namespace std;
`

export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;
	starterCodeJS: string;
	starterCodeCPP: string;
	starterCodeGO: string;
	handlerFunction: ((fn: any) => boolean) | string;
	starterFunctionName: string;
	cppChecker: string;
};

export type ProblemFirebase = {
	id: string;
	title: string;
	companies: string[];
	difficulty: string;
	likes: number;
	dislikes: number;
	order: number;
	
	
};

export default  cppHeader;