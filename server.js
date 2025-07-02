const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são permitidos!"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limite
  },
});

// Função para extrair código de barras do texto
function extractBarcode(text) {
  // Padrões comuns de código de barras em boletos brasileiros
  const patterns = [
    /(\d{5}\.?\d{5}\s?\d{5}\.?\d{6}\s?\d{5}\.?\d{6}\s?\d{1}\s?\d{14})/g, // Linha digitável
    /(\d{48})/g, // Código de barras direto (48 dígitos)
    /(\d{47})/g, // Código de barras sem DV (47 dígitos)
  ];

  for (let pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Remove espaços e pontos para retornar apenas números
      return matches[0].replace(/[\s.]/g, "");
    }
  }

  // Busca por sequências longas de números (fallback)
  const longNumbers = text.match(/\d{30,}/g);
  if (longNumbers && longNumbers.length > 0) {
    return longNumbers[0];
  }

  return null;
}

// Rota para upload e processamento do PDF
app.post("/api/extract-barcode", upload.single("boleto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    const filePath = req.file.path;
    let pdfData;

    try {
      // Lê o arquivo PDF
      const dataBuffer = fs.readFileSync(filePath);

      // Extrai texto do PDF (sem suporte a senha)
      pdfData = await pdf(dataBuffer);
    } catch (pdfError) {
      // Remove o arquivo temporário
      fs.unlinkSync(filePath);

      if (
        pdfError.message.includes("password") ||
        pdfError.message.includes("encrypted") ||
        pdfError.message.includes("Invalid PDF")
      ) {
        return res.status(401).json({
          error:
            "Este PDF está protegido por senha ou criptografado. Este aplicativo não suporta PDFs com senha.",
          isPasswordProtected: true,
        });
      }

      throw pdfError;
    }

    // Extrai código de barras do texto
    const barcode = extractBarcode(pdfData.text);

    if (!barcode) {
      fs.unlinkSync(filePath);
      return res.status(404).json({
        error: "Código de barras não encontrado no documento",
      });
    }

    // Remove o arquivo temporário
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      barcode: barcode,
      originalName: req.file.originalname,
      extractedAt: new Date(),
      fileSize: req.file.size,
    });
  } catch (error) {
    // Remove o arquivo em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Erro ao processar PDF:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao processar o arquivo",
    });
  }
});

// Rota de saúde da API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Arquivo muito grande. Limite de 10MB." });
    }
  }

  console.error("Erro não tratado:", error);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
