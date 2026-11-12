# Boleto Extractor — Backend

A Node.js REST API designed to extract payment barcode numbers from Brazilian bank slip PDFs (*boletos bancários*).

Built with **Express, Multer, and pdf-parse**, the application processes uploaded PDF documents and identifies common Brazilian payment code patterns.

**[Frontend Repository](https://github.com/jlcambraia/boleto-extractor-frontend)** · **[Live Frontend Demo](https://boleto-extractor-frontend-hf84.vercel.app/)**

## Overview

This backend provides PDF processing functionality for the Boleto Extractor application.

It accepts uploaded documents, extracts their textual content, and uses pattern matching to identify payment information.

The project demonstrates file upload handling, document parsing, backend validation, and API integration.

## Features

- PDF uploads through a REST endpoint
- File size limit of 10 MB
- PDF text extraction using pdf-parse
- Regular-expression matching for Brazilian payment codes
- Support for common bank slip code formats
- Fallback matching for long numeric sequences
- Error handling for invalid documents
- Handling of unsupported password-protected PDFs
- Health-check endpoint
- CORS support for frontend integration

## Tech Stack

- Node.js
- Express 4
- JavaScript
- Multer
- pdf-parse
- Regular Expressions
- dotenv
- CORS

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/extract-barcode` | Upload PDF and extract payment code |
| GET | `/api/health` | Check API status |

## Extraction Process

```text
PDF Upload
    |
    v
Multer File Validation
    |
    v
PDF Text Extraction
    |
    v
Regular Expression Matching
    |
    v
Payment Code Identification
    |
    v
JSON API Response
```

### Extraction Strategy

1. Receive a PDF document through the upload endpoint.
2. Extract readable text using `pdf-parse`.
3. Search for common Brazilian payment code patterns.
4. Attempt fallback matching when necessary.
5. Return the extracted result or an appropriate error response.

This approach focuses on extracting payment codes from text embedded in PDFs. It is not a general-purpose image barcode scanner.

## Getting Started

Requires Node.js 16 or later and npm.

```bash
git clone https://github.com/jlcambraia/boleto-extractor-backend.git
cd boleto-extractor-backend
npm install
npm run dev
```

To start without nodemon:

```bash
npm start
```

The project starts through `server.js`. Check its configuration for the active server port.

## API Usage

Submit a PDF using the extraction endpoint.

The request must use `multipart/form-data` with the upload field expected by the server's Multer configuration.

The response contains the extraction result or an error message.

## Validation and Limitations

- Only PDF documents are accepted
- Maximum upload size: 10 MB
- Password-protected or encrypted PDFs are unsupported
- Extraction is optimized for Brazilian bank slip formats
- Image-only scanned PDFs may require OCR, which is not part of the documented extraction flow

## Error Handling

The application handles invalid file formats, oversized uploads, protected PDFs, unrecognized payment codes, and processing failures.

## Related Repository

[Boleto Extractor — Frontend](https://github.com/jlcambraia/boleto-extractor-frontend)

## Potential Improvements

- Optical Character Recognition (OCR)
- Batch document processing
- Automated extraction tests
- Additional payment code formats
- Structured extraction logs
- More detailed API documentation

## Author

**João Luiz Cambraia**

[GitHub](https://github.com/jlcambraia) · [LinkedIn](https://www.linkedin.com/in/joaoluizcambraia/)
