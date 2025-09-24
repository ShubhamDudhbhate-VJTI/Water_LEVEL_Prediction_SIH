import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";
import fs from "fs";
import 'dotenv/config';
import winston from 'winston';

const app = express();
app.use(cors());
app.use(express.json());

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

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

let isIngested = false; // Track ingestion status

// Ingest uploaded PDFs into Chroma via Python
// app.post("/upload", upload.array("files", 10), (req, res) => {
//   const files = (req.files || []).map((f) => f.path);
//   if (!files.length) return res.status(400).json({ error: "No files uploaded" });

//   console.log("[UPLOAD] Files received:", files.map((p) => path.basename(p)));
//   const args = ["rag_script.py", "ingest", ...files];
//   const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });

//   let stderrOut = "";
//   pythonProcess.stderr.on("data", (data) => {
//     stderrOut += data.toString();
//   });
//   pythonProcess.stdout.on("data", (data) => {
//     process.stdout.write(`[PY-INGEST] ${data}`);
//   });

//   pythonProcess.on("close", (code) => {
//     if (code !== 0) {
//       console.error("Ingest error:", stderrOut);
//       return res.status(500).json({ error: "Failed to ingest documents" });
//     }
//     res.json({ success: true, files: files.map((p) => path.basename(p)) });
//   });
// });



app.post("/rag", (req, res) => {
  if (!isIngested) {
    return res.status(400).json({ error: "Please ingest files first using the 'ingest' mode." });
  }

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  console.log(`[#] RAG query: ${query}`);
  const args = ["rag_script.py", "query", query];
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
    res.json({ answer: output.trim() });
  });
});

// Ingest all PDF/CSV/TXT files from project root convenience endpoint
const supportedFileTypes = ['.pdf', '.csv', '.json', '.txt'];

function isSupportedDataFile(filename) {
  const lower = filename.toLowerCase();
  return supportedFileTypes.some((ext) => lower.endsWith(ext));
}

function spawnIngest(files) {
  if (!files.length) return;
  console.log('[WATCH] Ingesting new files:', files.map((f) => path.basename(f)));
  const args = ['rag_script.py', 'ingest', ...files];
  const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });
  pythonProcess.stdout.on('data', (d) => process.stdout.write(`[PY-INGEST] ${d}`));
  pythonProcess.stderr.on('data', (d) => process.stderr.write(`[PY-INGEST:ERR] ${d}`));
}

function watchDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  try {
    fs.watch(dirPath, { persistent: true }, (eventType, filename) => {
      if (isSupportedDataFile(filename)) {
        const filePath = path.join(dirPath, filename);
        spawnIngest([filePath]);
      }
    });
    console.log(`[WATCH] Watching ${dirPath} for new supported files...`);
  } catch (e) {
    console.error('[WATCH] Failed to watch', dirPath, e);
  }
}

app.post("/ingest-all", (_req, res) => {
  const root = process.cwd();
  const rootFiles = fs.readdirSync(root)
    .filter((f) => isSupportedDataFile(f))
    .map((f) => path.join(root, f));
  const uploadsFiles = fs.existsSync(uploadsDir)
    ? fs.readdirSync(uploadsDir)
        .filter((f) => isSupportedDataFile(f))
        .map((f) => path.join(uploadsDir, f))
    : [];
  const candidates = [...rootFiles, ...uploadsFiles];
  if (!candidates.length) {
    logger.warn("No supported files in project root");
    return res.status(400).json({ error: "No supported files in project root" });
  }

  logger.info("[INGEST-ALL] Files:", candidates.map((p) => path.basename(p)));
  const args = ["rag_script.py", "ingest", ...candidates];
  const pythonProcess = spawn(PYTHON_EXEC, args, { cwd: process.cwd() });

  pythonProcess.stdout.on("data", (d) => logger.info(`[PY-INGEST] ${d}`));
  pythonProcess.stderr.on("data", (d) => logger.error(`[PY-INGEST:ERR] ${d}`));
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      isIngested = true; // Mark ingestion as complete
      logger.info("Ingestion completed successfully");
      res.json({ success: true, files: candidates.map((p) => path.basename(p)) });
    } else {
      isIngested = false; // Mark ingestion as failed
      logger.error("Ingestion failed");
      res.status(500).json({ error: "Ingestion failed" });
    }
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