import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/rag", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  // Call your RAG Python script
exec(`python rag_script.py "${query}"`, (err, stdout, stderr) => {
  console.log("RAG stdout:", stdout);
  if (err) return res.status(500).json({ error: stderr || err.message });
  res.json({ answer: stdout.trim() });
});
});

app.listen(5000, () => {
  console.log("✅ RAG API running at http://localhost:5000/rag");
});