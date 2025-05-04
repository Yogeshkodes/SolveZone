import { db } from "../libs/db.js";
import {
  pollBatchResults,
  getJudge0LanguageId,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    referenceSolutions,
    codeSnippet,
    testcases,
  } = req.body;

  if (req.user.role !== "ADMIN")
    return res.status(403).json({
      error: "You are not allowed to create a problem",
    });

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageID = getJudge0LanguageId(language);

      if (!languageID)
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageID,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippet,
          referenceSolutions,
          hints,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        sucess: true,
        message: "Message Created Successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  
};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemSolvedByUser = async (req, res) => {};
