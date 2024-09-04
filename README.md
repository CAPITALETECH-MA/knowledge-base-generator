# Markdown Combiner API

This API combines multiple Markdown files from a specified directory into a single Markdown file, estimating the token count of the combined document.

## Features

- Crawls a specified directory for Markdown files
- Combines all found Markdown files into a single document
- Preserves file structure in the combined document
- Estimates token count of the combined document
- Infers output filename based on the input directory structure

## Setup

1. Install dependencies:
   ```bash
   npm install express
   ```

2. Run the server:
   ```bash
   node index.js
   ```

The server will start on port 7777.

## API Usage

### Endpoint: POST /combine-docs

Combines Markdown files from a specified directory.

#### Request Body