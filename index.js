const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const PORT = 7777;

function estimateTokens(text) {
    const words = text.split(/\s+/);
    return Math.ceil(words.length * 1.3);
}

async function crawlDirectory(dir) {
    let results = [];
    const files = await fs.readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            results = results.concat(await crawlDirectory(filePath));
        } else if (path.extname(file).toLowerCase() === '.md') {
            results.push(filePath);
        }
    }

    return results;
}

async function combineMarkdownFiles(files, baseDir) {
    let combinedContent = '';

    for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const relativePath = path.relative(baseDir, file);

        combinedContent += `\n\n<!-- File: ${relativePath} -->\n\n`;
        combinedContent += `# ${path.basename(file, '.md')}\n\n`;
        combinedContent += content;
        combinedContent += '\n\n---\n';
    }

    return combinedContent.trim();
}

function inferOutputFileName(docsPath) {
    // Split the path and remove empty elements
    const pathParts = docsPath.split(path.sep).filter(Boolean);

    // Take the last 3 parts of the path (or fewer if there aren't 3)
    const relevantParts = pathParts.slice(-3);

    // Join the parts with hyphens and convert to lowercase
    return relevantParts.join('-').toLowerCase();
}

app.post('/combine-docs', async (req, res) => {
    try {
        let { docsPath, outputFileName } = req.body;

        if (!docsPath) {
            return res.status(400).json({ error: 'Missing docsPath in request body' });
        }

        // Normalize the path to handle both Unix and Windows-style paths
        docsPath = path.normalize(docsPath);

        // Check if the directory exists
        try {
            await fs.access(docsPath);
        } catch (error) {
            return res.status(400).json({ error: 'The specified docsPath does not exist or is not accessible' });
        }

        // Infer output file name if not provided
        if (!outputFileName) {
            outputFileName = inferOutputFileName(docsPath);
        }

        // Add .md extension if not present
        if (path.extname(outputFileName).toLowerCase() !== '.md') {
            outputFileName += '.md';
        }

        const markdownFiles = await crawlDirectory(docsPath);
        const combinedContent = await combineMarkdownFiles(markdownFiles, docsPath);

        // Create 'outputs' folder if it doesn't exist
        const outputsDir = path.join(__dirname, 'outputs');
        await fs.mkdir(outputsDir, { recursive: true });

        const outputPath = path.join(outputsDir, outputFileName);
        await fs.writeFile(outputPath, combinedContent);

        // Estimate token count
        const estimatedTokens = estimateTokens(combinedContent);

        res.json({
            message: 'Docs combined successfully',
            outputPath,
            outputFileName,
            estimatedTokens,
            estimatedTokensMessage: `The combined document is approximately ${estimatedTokens} tokens.`
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});