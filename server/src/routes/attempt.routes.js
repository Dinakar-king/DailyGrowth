import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/evaluate-dsa", auth, async (req, res) => {
  const { code, language, testCases } = req.body;

  let passedCases = 0;
  const results = [];

  for (const tc of testCases) {
    // Send code to execution engine (e.g., Piston API)
    const execRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language || "python",
        version: "*",
        files: [{ content: code }],
        stdin: tc.input,
      }),
    });

    const outData = await execRes.json();
    const actualOutput = outData.run?.stdout?.trim();
    const passed = actualOutput === tc.expectedOutput.trim();

    if (passed) passedCases++;
    results.push({ input: tc.input, expected: tc.expectedOutput, actual: actualOutput, passed });
  }

  const score = Math.round((passedCases / testCases.length) * 100);
  res.json({ score, passedCases, totalCases: testCases.length, details: results });
});

export default router;