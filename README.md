# Markdown Combiner API

This API combines multiple Markdown files from a specified directory into a single Markdown file, estimating the token count of the combined document.

## Features

- Crawls a specified directory for Markdown files
- Combines all found Markdown files into a single document
- Preserves file structure in the combined document
- Estimates token count of the combined document
- Infers output filename based on the input directory structure
- Handles both Unix and Windows-style paths

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/CAPITALETECH-MA/knowledge-base-generator.git
   cd markdown-combiner-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   node index.js
   ```

The server will start on port 7777.

## API Usage

### Endpoint: POST /combine-docs

Combines Markdown files from a specified directory.

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| docsPath | string | The path to the directory containing Markdown files |
| outputFileName | string | (Optional) The desired name for the output file |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| message | string | Success message |
| outputPath | string | Path to the combined Markdown file |
| outputFileName | string | Name of the output file |
| estimatedTokens | number | Estimated token count of the combined document |
| estimatedTokensMessage | string | Human-readable message about the token count |

#### Example Usage with cURL






