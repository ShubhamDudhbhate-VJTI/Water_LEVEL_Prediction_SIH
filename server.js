import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";
import fs from "fs";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Storage for uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Resolve Python executable (prefer project venv)
const pythonFromVenv = process.platform === "win32"
  ? path.join(process.cwd(), ".venv", "Scripts", "python.exe")
  : path.join(process.cwd(), ".venv", "bin", "python");
const PYTHON_EXEC = fs.existsSync(pythonFromVenv) ? pythonFromVenv : "python";

// Ingest uploaded PDFs into Chroma via Python
app.post("/upload", upload.array("files", 10), (req, res) => {
  const files = (req.files || []).map((f) => f.path);
  if (!files.length) return res.status(400).json({ error: "No files uploaded" });

  console.log("[UPLOAD] Files received:", files.map((p) => path.basename(p)));
  const args = ["rag_script.py", "ingest", ...files];
  const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });

  let stderrOut = "";
  pythonProcess.stderr.on("data", (data) => {
    stderrOut += data.toString();
  });
  pythonProcess.stdout.on("data", (data) => {
    process.stdout.write(`[PY-INGEST] ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Ingest error:", stderrOut);
      return res.status(500).json({ error: "Failed to ingest documents" });
    }
    res.json({ success: true, files: files.map((p) => path.basename(p)) });
  });
});

app.post("/rag", (req, res) => {
  const { query, source } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });
  console.log(`[#] RAG query: ${query}${source ? ` | source=${source}` : ''}`);
  const args = ["rag_script.py", "query", query, ...(source ? ["--source", source] : [])];
  const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });

  let output = "";
  let stderrOut = "";
  pythonProcess.stdout.on("data", (data) => {
    const chunk = data.toString();
    output += chunk;
    process.stdout.write(`[PY-RAG] ${chunk}`);
  });
  pythonProcess.stderr.on("data", (data) => {
    stderrOut += data.toString();
  });
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("RAG query error:", stderrOut);
      return res.status(500).json({ error: "RAG query failed" });
    }
    try {
      const json = JSON.parse(output.trim());
      // Normalize shape
      if (typeof json === "string") {
        return res.json({ answer: json });
      }
      const usedDocs = (json.sources || []).map((s) => s.source).filter(Boolean);
      if (json.found) {
        console.log(`[RAG] Answered from documents: ${[...new Set(usedDocs)].join(", ") || "(unknown)"}`);
        // Detailed source list with scores
        try {
          const details = (json.sources || [])
            .map((s) => {
              const src = s && s.source ? String(s.source) : "unknown";
              const score = typeof s.score === "number" ? ` (score ${s.score.toFixed(3)})` : "";
              const idx = typeof s.chunk_index === "number" ? ` [chunk ${s.chunk_index}]` : "";
              return `${src}${idx}${score}`;
            })
            .join(", ");
          if (details) console.log(`[RAG] Source details: ${details}`);
        } catch {}
        // Show context preview (first 300 chars)
        if (json.context) {
          const preview = String(json.context).slice(0, 300).replace(/\s+/g, " ");
          console.log(`[RAG] Context preview: ${preview}${String(json.context).length > 300 ? "..." : ""}`);
        }
      } else {
        console.log(`[RAG] No relevant documents. Falling back to AI.`);
      }
      const apiKey = process.env.GROQ_API_KEY;
      if (apiKey) {
        generateWithGroq(apiKey, query, json.context || "").then((groqAnswer) => {
          return res.json({
            answer: groqAnswer || json.answer || "",
            sources: json.sources ?? [],
            context: json.context ?? undefined,
            found: json.found ?? (json.sources && json.sources.length > 0),
            provider: "groq",
          });
        }).catch(() => {
          return res.json({
            answer: json.answer ?? "",
            sources: json.sources ?? [],
            context: json.context ?? undefined,
            found: json.found ?? (json.sources && json.sources.length > 0),
          });
        });
        return;
      }
      return res.json({
        answer: json.answer ?? "",
        sources: json.sources ?? [],
        context: json.context ?? undefined,
        found: json.found ?? (json.sources && json.sources.length > 0),
      });
    } catch (e) {
      // Fallback for legacy plain-text output
      res.json({ answer: output.trim() });
    }
  });
});

// Ingest all PDF/CSV/TXT files from project root convenience endpoint
app.post("/ingest-all", (_req, res) => {
  const root = process.cwd();
  // Include uploads folder plus project root
  const rootFiles = fs.readdirSync(root)
    .filter((f) => f.toLowerCase().endsWith(".pdf") || f.toLowerCase().endsWith(".csv") || f.toLowerCase().endsWith(".txt"))
    .map((f) => path.join(root, f));
  const uploadsFiles = fs.existsSync(uploadsDir)
    ? fs.readdirSync(uploadsDir)
        .filter((f) => f.toLowerCase().endsWith(".pdf") || f.toLowerCase().endsWith(".csv") || f.toLowerCase().endsWith(".txt"))
        .map((f) => path.join(uploadsDir, f))
    : [];
  const candidates = [...rootFiles, ...uploadsFiles];
  if (!candidates.length) return res.status(400).json({ error: "No PDF/CSV/TXT files in project root" });
  console.log("[INGEST-ALL] Files:", candidates.map((p) => path.basename(p)));
  const args = ["rag_script.py", "ingest", ...candidates];
  const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });
  pythonProcess.stdout.on("data", (d) => process.stdout.write(`[PY-INGEST] ${d}`));
  let stderrOut = "";
  pythonProcess.stderr.on("data", (d) => (stderrOut += d.toString()));
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Ingest-all error:", stderrOut);
      return res.status(500).json({ error: "Ingest-all failed" });
    }
    res.json({ success: true, files: candidates.map((p) => path.basename(p)) });
  });
});

// Auto-ingest on server start (non-blocking)
setTimeout(() => {
  try {
    const root = process.cwd();
    const rootFiles = fs.readdirSync(root)
      .filter((f) => f.toLowerCase().endsWith(".pdf") || f.toLowerCase().endsWith(".csv") || f.toLowerCase().endsWith(".txt"))
      .map((f) => path.join(root, f));
    const uploadsFiles = fs.existsSync(uploadsDir)
      ? fs.readdirSync(uploadsDir)
          .filter((f) => f.toLowerCase().endsWith(".pdf") || f.toLowerCase().endsWith(".csv") || f.toLowerCase().endsWith(".txt"))
          .map((f) => path.join(uploadsDir, f))
      : [];
    const candidates = [...rootFiles, ...uploadsFiles];
    if (!candidates.length) return;
    console.log("[BOOT] Auto-ingest starting for:", candidates.map((p) => path.basename(p)));
    const args = ["rag_script.py", "ingest", ...candidates];
    const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });
    pythonProcess.stdout.on("data", (d) => process.stdout.write(`[PY-INGEST] ${d}`));
    pythonProcess.stderr.on("data", (d) => process.stderr.write(`[PY-INGEST:ERR] ${d}`));
  } catch (e) {
    console.error("[BOOT] Auto-ingest failed:", e);
  }
}, 1500);

// List known documents (from uploads directory)
app.get("/documents", (_req, res) => {
  try {
    const files = fs
      .readdirSync(uploadsDir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: "Failed to list documents" });
  }
});

app.listen(5000, () => {
  console.log("✅ RAG API running at http://localhost:5000/rag");
});

// -----------------------------
// File watchers to auto-ingest new files added manually to folders
// -----------------------------
function isSupportedDataFile(filename) {
  const lower = filename.toLowerCase();
  return lower.endsWith('.pdf') || lower.endsWith('.csv') || lower.endsWith('.txt') || lower.endsWith('.json');
}

function spawnIngest(files) {
  if (!files.length) return;
  console.log('[WATCH] Ingesting new files:', files.map((f) => path.basename(f)));
  const args = ['rag_script.py', 'ingest', ...files];
  const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });
  pythonProcess.stdout.on('data', (d) => process.stdout.write(`[PY-INGEST] ${d}`));
  pythonProcess.stderr.on('data', (d) => process.stderr.write(`[PY-INGEST:ERR] ${d}`));
}

const pendingDebounce = new Map();
function watchDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  try {
    fs.watch(dirPath, { persistent: true }, (eventType, filename) => {
      if (!filename || !isSupportedDataFile(filename)) return;
      const full = path.join(dirPath, filename);
      // debounce per file to avoid duplicate triggers
      clearTimeout(pendingDebounce.get(full));
      const t = setTimeout(() => {
        if (fs.existsSync(full)) spawnIngest([full]);
      }, 500);
      pendingDebounce.set(full, t);
    });
    console.log(`[WATCH] Watching ${dirPath} for new PDF/CSV/TXT/JSON files...`);
  } catch (e) {
    console.error('[WATCH] Failed to watch', dirPath, e);
  }
}

// Start watchers for manual file drops into project root and uploads/
watchDir(process.cwd());
watchDir(uploadsDir);

async function generateWithGroq(apiKey, userQuery, context) {
  try {
    const prompt = context
      ? `Use ONLY the following context to answer. If the answer isn't in the context, reply that you don't know.\n\nContext:\n${context}\n\nQuestion: ${userQuery}\nAnswer:`
      : userQuery;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        temperature: 0.2,
        max_tokens: 800,
        messages: [
          { role: 'system', content: 'Answer concisely and factually.' },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!response.ok) {
      console.error('[GROQ] HTTP', response.status);
      return '';
    }
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return text.trim();
  } catch (e) {
    console.error('[GROQ] Error', e);
    return '';
  }
}