import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { fetchWithAuth } from "../api";

export default function AdminDashboard() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("create");
  const [category, setCategory] = useState("aptitude");

  const [mcqList, setMcqList] = useState([
    { title: "MCQ Question 1", questionText: "", options: ["", "", "", ""], correctAnswer: "A" },
  ]);

  const [codingList, setCodingList] = useState([
    {
      title: "Coding Problem 1",
      questionText: "",
      starterCode: "def solution(nums, target):\n    # Write your solution here\n    return []",
      input: "",
      expectedOutput: "",
    },
  ]);

  const [includeSql, setIncludeSql] = useState(true);
  const [sqlChallenge, setSqlChallenge] = useState({
    title: "SQL Query Problem",
    questionText: "Write a SQL query to find the second highest salary from the Employee table.",
    starterCode: "SELECT MAX(salary) FROM Employee WHERE ...",
    expectedOutput: "$124,500",
  });

  const [commList, setCommList] = useState([
    { title: "Audio Prompt 1", questionText: "", audioFile: null },
  ]);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchWithAuth("/admin/student-submissions")
        .then((d) => setSubmissions(Array.isArray(d) ? d : []))
        .catch(() => {});
    } else if (activeTab === "feedbacks") {
      fetchWithAuth("/admin/student-feedbacks")
        .then((d) => setFeedbacks(Array.isArray(d) ? d : []))
        .catch(() => {});
    }
  }, [activeTab]);

  const addMcqItem = () => {
    setMcqList([
      ...mcqList,
      {
        title: `MCQ Question ${mcqList.length + 1}`,
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "A",
      },
    ]);
  };

  const removeMcqItem = (index) => {
    if (mcqList.length === 1) return;
    setMcqList(mcqList.filter((_, i) => i !== index));
  };

  const updateMcqField = (index, field, value) => {
    const updated = [...mcqList];
    updated[index][field] = value;
    setMcqList(updated);
  };

  const updateMcqOption = (qIndex, optIndex, value) => {
    const updated = [...mcqList];
    updated[qIndex].options[optIndex] = value;
    setMcqList(updated);
  };

  const addCodingItem = () => {
    setCodingList([
      ...codingList,
      {
        title: `Coding Problem ${codingList.length + 1}`,
        questionText: "",
        starterCode: "def solution():\n    pass",
        input: "",
        expectedOutput: "",
      },
    ]);
  };

  const removeCodingItem = (index) => {
    if (codingList.length === 1) return;
    setCodingList(codingList.filter((_, i) => i !== index));
  };

  const updateCodingField = (index, field, value) => {
    const updated = [...codingList];
    updated[index][field] = value;
    setCodingList(updated);
  };

  const addCommItem = () => {
    setCommList([
      ...commList,
      { title: `Audio Prompt ${commList.length + 1}`, questionText: "", audioFile: null },
    ]);
  };

  const handlePublishBatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("category", category);

    if (category === "aptitude") {
      const formatted = mcqList.map((m) => {
        const charIdx = m.correctAnswer.charCodeAt(0) - 65;
        const answerText = m.options[charIdx] || m.options[0];
        return {
          title: m.title,
          questionText: m.questionText,
          options: m.options,
          correctAnswer: answerText,
        };
      });
      formData.append("questionsData", JSON.stringify(formatted));
    } else if (category === "dsa") {
      const formatted = codingList.map((c) => ({
        title: c.title,
        questionText: c.questionText,
        starterCode: c.starterCode,
        testCases: [{ input: c.input, expectedOutput: c.expectedOutput }],
      }));
      formData.append("questionsData", JSON.stringify(formatted));

      if (includeSql && sqlChallenge.questionText) {
        formData.append("sqlChallenge", JSON.stringify(sqlChallenge));
      }
    } else if (category === "communication") {
      const formatted = commList.map((comm) => ({
        title: comm.title,
        questionText: comm.questionText,
      }));
      formData.append("questionsData", JSON.stringify(formatted));
      commList.forEach((comm) => {
        if (comm.audioFile) {
          formData.append("audioFiles", comm.audioFile);
        }
      });
    }

    try {
      const data = await fetchWithAuth("/admin/create-batch-questions", {
        method: "POST",
        body: formData,
      });

      setStatus(`✅ ${data.message}`);
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: colors.bg, padding: "32px 24px 80px", color: colors.textPrimary }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.12)", padding: "3px 8px", borderRadius: "6px" }}>
              STAFF COMMAND CENTER
            </span>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "6px 0 2px", color: colors.textPrimary }}>
              Batch Assessment Question Publisher
            </h1>
            <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0 }}>
              Add up to 20+ aptitude MCQs, multiple coding challenges + SQL slots, or audio drills.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", backgroundColor: colors.cardBg, padding: "4px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
            <button
              onClick={() => setActiveTab("create")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: activeTab === "create" ? "#0284C7" : "transparent",
                color: activeTab === "create" ? "#fff" : colors.textSecondary,
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              ✍️ Batch Creator
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: activeTab === "submissions" ? "#0284C7" : "transparent",
                color: activeTab === "submissions" ? "#fff" : colors.textSecondary,
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              📝 Candidate Submissions
            </button>
            <button
              onClick={() => setActiveTab("feedbacks")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: activeTab === "feedbacks" ? "#0284C7" : "transparent",
                color: activeTab === "feedbacks" ? "#fff" : colors.textSecondary,
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              ⭐ Candidate Feedbacks
            </button>
          </div>
        </div>

        {status && (
          <div style={{ padding: "14px 20px", borderRadius: "12px", backgroundColor: status.includes("✅") ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", border: `1px solid ${status.includes("✅") ? "#10B981" : "#EF4444"}`, color: status.includes("✅") ? "#10B981" : "#EF4444", fontSize: "13px", fontWeight: "600" }}>
            {status}
          </div>
        )}

        {activeTab === "create" && (
          <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", marginBottom: "8px" }}>
                Select Domain Batch
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setCategory("aptitude")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `1px solid ${category === "aptitude" ? "#38BDF8" : colors.border}`,
                    backgroundColor: category === "aptitude" ? "rgba(56, 189, 248, 0.15)" : colors.innerBg,
                    color: category === "aptitude" ? "#38BDF8" : colors.textPrimary,
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  📊 Aptitude Track ({mcqList.length} MCQs)
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("dsa")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `1px solid ${category === "dsa" ? "#38BDF8" : colors.border}`,
                    backgroundColor: category === "dsa" ? "rgba(56, 189, 248, 0.15)" : colors.innerBg,
                    color: category === "dsa" ? "#38BDF8" : colors.textPrimary,
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  💻 Coding & DSA ({codingList.length} Problems + 1 SQL)
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("communication")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `1px solid ${category === "communication" ? "#38BDF8" : colors.border}`,
                    backgroundColor: category === "communication" ? "rgba(56, 189, 248, 0.15)" : colors.innerBg,
                    color: category === "communication" ? "#38BDF8" : colors.textPrimary,
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🗣️ Communication Audio Drills
                </button>
              </div>
            </div>

            <form onSubmit={handlePublishBatch} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {category === "aptitude" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, margin: 0 }}>
                      Aptitude Question Set ({mcqList.length} Total)
                    </h3>
                    <button
                      type="button"
                      onClick={addMcqItem}
                      style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: "#0284C7", color: "#fff", border: "none", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                    >
                      ➕ Add MCQ ({mcqList.length + 1})
                    </button>
                  </div>

                  {mcqList.map((mcq, idx) => (
                    <div key={idx} style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#38BDF8" }}>
                          QUESTION #{idx + 1}
                        </span>
                        {mcqList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMcqItem(idx)}
                            style={{ backgroundColor: "transparent", border: "none", color: "#EF4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                          >
                            🗑️ Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Question Title / Subtopic"
                        value={mcq.title}
                        onChange={(e) => updateMcqField(idx, "title", e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />

                      <textarea
                        required
                        rows={2}
                        placeholder="Enter the full question statement..."
                        value={mcq.questionText}
                        onChange={(e) => updateMcqField(idx, "questionText", e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {["A", "B", "C", "D"].map((optLetter, optIdx) => (
                          <div key={optIdx}>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "2px" }}>
                              Option {optLetter}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${optLetter} text`}
                              value={mcq.options[optIdx]}
                              onChange={(e) => updateMcqOption(idx, optIdx, e.target.value)}
                              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                            />
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase" }}>Correct Answer:</label>
                        <select
                          value={mcq.correctAnswer}
                          onChange={(e) => updateMcqField(idx, "correctAnswer", e.target.value)}
                          style={{ padding: "6px 12px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "12px", outline: "none" }}
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {category === "dsa" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, margin: 0 }}>
                      Coding Challenges ({codingList.length} Problems)
                    </h3>
                    <button
                      type="button"
                      onClick={addCodingItem}
                      style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: "#0284C7", color: "#fff", border: "none", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                    >
                      ➕ Add Coding Problem ({codingList.length + 1})
                    </button>
                  </div>

                  {codingList.map((codeItem, idx) => (
                    <div key={idx} style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#38BDF8" }}>
                          CODING PROBLEM #{idx + 1}
                        </span>
                        {codingList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCodingItem(idx)}
                            style={{ backgroundColor: "transparent", border: "none", color: "#EF4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                          >
                            🗑️ Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Problem Title"
                        value={codeItem.title}
                        onChange={(e) => updateCodingField(idx, "title", e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />

                      <textarea
                        required
                        rows={3}
                        placeholder="Problem Description, Constraints and Output specification..."
                        value={codeItem.questionText}
                        onChange={(e) => updateCodingField(idx, "questionText", e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />

                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "2px" }}>Starter Code Template</label>
                        <textarea
                          rows={3}
                          value={codeItem.starterCode}
                          onChange={(e) => updateCodingField(idx, "starterCode", e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: "#38BDF8", fontFamily: "monospace", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "2px" }}>Sample Input</label>
                          <input
                            type="text"
                            placeholder="e.g. root = [1,null,2,3]"
                            value={codeItem.input}
                            onChange={(e) => updateCodingField(idx, "input", e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "2px" }}>Expected Output</label>
                          <input
                            type="text"
                            placeholder="e.g. [1,3,2]"
                            value={codeItem.expectedOutput}
                            onChange={(e) => updateCodingField(idx, "expectedOutput", e.target.value)}
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#F59E0B" }}>
                        🗄️ DEDICATED SQL QUERY SLOT
                      </span>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                        <input type="checkbox" checked={includeSql} onChange={(e) => setIncludeSql(e.target.checked)} />
                        Include SQL Problem
                      </label>
                    </div>

                    {includeSql && (
                      <>
                        <input
                          type="text"
                          placeholder="SQL Problem Title"
                          value={sqlChallenge.title}
                          onChange={(e) => setSqlChallenge({ ...sqlChallenge, title: e.target.value })}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                        />

                        <textarea
                          rows={2}
                          placeholder="Write the SQL problem statement..."
                          value={sqlChallenge.questionText}
                          onChange={(e) => setSqlChallenge({ ...sqlChallenge, questionText: e.target.value })}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                        />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "2px" }}>Starter SQL</label>
                            <input
                              type="text"
                              value={sqlChallenge.starterCode}
                              onChange={(e) => setSqlChallenge({ ...sqlChallenge, starterCode: e.target.value })}
                              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: "#38BDF8", fontFamily: "monospace", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "2px" }}>Expected Output Sample</label>
                            <input
                              type="text"
                              value={sqlChallenge.expectedOutput}
                              onChange={(e) => setSqlChallenge({ ...sqlChallenge, expectedOutput: e.target.value })}
                              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {category === "communication" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, margin: 0 }}>
                      Spoken & Verbal Drills ({commList.length} Prompts)
                    </h3>
                    <button
                      type="button"
                      onClick={addCommItem}
                      style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: "#0284C7", color: "#fff", border: "none", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                    >
                      ➕ Add Audio Prompt ({commList.length + 1})
                    </button>
                  </div>

                  {commList.map((comm, idx) => (
                    <div key={idx} style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#38BDF8" }}>
                        AUDIO PROMPT #{idx + 1}
                      </span>

                      <input
                        type="text"
                        required
                        placeholder="Drill Title"
                        value={comm.title}
                        onChange={(e) => {
                          const updated = [...commList];
                          updated[idx].title = e.target.value;
                          setCommList(updated);
                        }}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />

                      <textarea
                        required
                        rows={2}
                        placeholder="Speaking instructions for candidate..."
                        value={comm.questionText}
                        onChange={(e) => {
                          const updated = [...commList];
                          updated[idx].questionText = e.target.value;
                          setCommList(updated);
                        }}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", backgroundColor: colors.cardBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                      />

                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: colors.textSecondary, marginBottom: "4px" }}>Upload Audio (.mp3, .wav)</label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            const updated = [...commList];
                            updated[idx].audioFile = e.target.files[0];
                            setCommList(updated);
                          }}
                          style={{ color: colors.textPrimary, fontSize: "12px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  backgroundColor: "#0284C7",
                  backgroundImage: "linear-gradient(135deg, #38BDF8, #0284C7)",
                  color: "#fff",
                  border: "none",
                  fontWeight: "800",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Publishing Batch..." : `🚀 Publish Complete ${category.toUpperCase()} Assessment Batch`}
              </button>
            </form>
          </div>
        )}

        {activeTab === "submissions" && (
          <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "28px" }}>
            <h2 style={{ fontSize: "18px", color: colors.textPrimary, margin: "0 0 16px" }}>Candidate Code & Answers Submissions</h2>
            {submissions.length === 0 ? (
              <p style={{ color: colors.textSecondary, fontSize: "13px" }}>No candidate submissions recorded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {submissions.map((sub, i) => (
                  <div key={i} style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: colors.textPrimary }}>{sub.studentName}</strong>
                        <span style={{ marginLeft: "10px", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", textTransform: "uppercase" }}>
                          {sub.category}
                        </span>
                      </div>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: sub.score >= 70 ? "#10B981" : "#EF4444" }}>
                        Score: {sub.score}/100
                      </span>
                    </div>

                    {sub.submittedAnswers?.map((ans, idx) => (
                      <div key={idx} style={{ marginTop: "10px", backgroundColor: colors.cardBg, padding: "12px", borderRadius: "8px", border: `1px solid ${colors.border}` }}>
                        <div style={{ color: colors.textSecondary, fontSize: "11px", marginBottom: "4px" }}>
                          Question: {ans.questionTitle || `Q${idx + 1}`}
                        </div>
                        <pre style={{ margin: 0, fontSize: "11px", color: "#38BDF8", fontFamily: "monospace", overflowX: "auto" }}>
                          {ans.userCodeOrAnswer}
                        </pre>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "feedbacks" && (
          <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "28px" }}>
            <h2 style={{ fontSize: "18px", color: colors.textPrimary, margin: "0 0 16px" }}>Candidate Feedback & Ratings</h2>
            {feedbacks.length === 0 ? (
              <p style={{ color: colors.textSecondary, fontSize: "13px" }}>No candidate feedback recorded yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {feedbacks.map((fb, i) => (
                  <div key={i} style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <strong style={{ color: colors.textPrimary, fontSize: "14px" }}>{fb.studentName}</strong>
                      <span style={{ color: "#FBBF24" }}>{"⭐".repeat(fb.feedbackRating || 5)}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: colors.textSecondary, margin: "0 0 8px", fontStyle: "italic" }}>
                      "{fb.feedbackComment}"
                    </p>
                    <span style={{ fontSize: "10px", color: colors.textSecondary }}>Domain: {fb.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}