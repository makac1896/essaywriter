const { google } = require('googleapis');
const fs = require('fs');

// Document ID and credentials file path
const DOCUMENT_ID = 'your_document_id';
const CREDENTIALS_PATH = 'path_to_your_credentials.json';

// Load credentials from the JSON file
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: 'https://www.googleapis.com/auth/documents',
});

async function setFontForDocument() {
  const docs = google.docs({ version: 'v1', auth });

  try {
    // Set the font for the entire document
    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [
          {
            updateTextStyle: {
              range: {
                startIndex: 1, // Start from index 1 (after the heading)
                endIndex: 10000, // Set a large enough value to cover the entire document
              },
              textStyle: {
                fontFamily: 'Arial', // Set the font for the entire document
                fontSize: {
                  magnitude: 12,
                  unit: 'PT',
                },
              },
              fields: 'fontFamily,fontSize', // Specify the fields to update
            },
          },
        ],
      },
    });

    // Insert a paragraph
    const paragraph = `**Prompt: Why Us?** \n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1, // Insert after the heading (index 2 is the newline and index 3 is the start of the paragraph)
              },
              text: `\n${paragraph}`,
            },
          },
        ],
      },
    });

    console.log('Text insertion completed.');
  } catch (error) {
    console.error('Error inserting text:', error.message);
  }
}

setFontForDocument();
