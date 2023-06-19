
import { Problem } from "../models/problem";
import { twoSum } from "./two-sum";


interface ProblemMap {
	[key: string]: Problem;
}

export const problems: ProblemMap = {
	"two-sum": twoSum,
	
};