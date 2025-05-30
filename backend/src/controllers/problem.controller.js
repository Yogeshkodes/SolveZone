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

      console.log("This is are tokens ", tokens);

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
        message: "Problem Created Successfully",
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
  try {
    const problem = await db.problem.findMany();

    if (!problem)
      return res.status(404).json({
        sucess: false,
        error: "No problem Found",
      });

    if (problem.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No problems available",
        problem: [],
      });
    }

    res.status(200).json({
      sucess: true,
      message: "Problems Fetched Succesfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error while fetching Problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem)
      return res.status(404).json({
        sucess: false,
        error: "No problem Found",
      });

    res.status(200).json({
      sucess: true,
      message: "Problem Fetched Succesfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error while fetching Problem",
    });
  }
};

export const updateProblem = async (req, res) => {
  // from id we will check that if problem exist or not
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem)
    return res.status(404).json({
      sucess: false,
      error: "No problem Found",
    });

  // after checking we'll fetch details to update problem
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

      const updatedProblem = await db.problem.update({
        where: {
          id,
        },
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
        message: "Problem Updated Successfully",
        problem: updateProblem,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      sucess: false,
      message: "Error while updating Problem",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "ADMIN")
    return res.status(403).json({
      error: "You are not allowed to create a problem",
    });
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem)
      return res.status(500).json({
        sucess: false,
        message: "Problem does not exist",
      });

    await db.problem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      sucess: true,
      message: "Problem has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      error: "Issue in deleting problem",
    });
  }
};

export const getAllProblemSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems :", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};
