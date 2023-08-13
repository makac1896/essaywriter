//google docs api
const fs = require("fs").promises;
const process = require("process");
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
// // const { gapi } = require('gapi-script');

//sample document
const sampleRequestBody = {
    title: "My Simple Document",
    body: {
      content: [
        {
          paragraph: {
            elements: [
              {
                textRun: {
                  content: "Document Heading",
                  bold: true,
                  fontSize: {
                    magnitude: 20,
                    unit: "PT",
                  },
                },
              },
            ],
          },
        },
        {
          paragraph: {
            elements: [
              {
                textRun: {
                  content: "This is a simple paragraph in the document.",
                  fontSize: {
                    magnitude: 12,
                    unit: "PT",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
  

// // If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"];

async function printDocTitle(auth) {
  const docs = google.docs({ version: "v1", auth });
  const res = await docs.documents.get({
    documentId: "1i4LGbuYny-olawwoc7-5ti1uWyUT0_ia1WXZ_9FfICw",
  });
  console.log(`The title of the document is: ${res.data.title}`);
}

async function createDoc(auth, requestBody = {title: "Essay Review | Personal Statement"}, prompt="sample", essayBody="sample" ){
    const drive = google.drive({ version: "v3", auth });
    const docs = google.docs({ version: "v1", auth });   
    const res = await docs.documents.create({
    requestBody
    });

    const newDocId = res.data.documentId;

    // Set sharing permissions to make the document accessible to anyone with the link
    await drive.permissions.create({
        fileId: newDocId,
        requestBody: {
          role: 'writer', // Change the role as needed (e.g., 'reader', 'writer', 'commenter', 'owner')
          type: 'anyone',
          allowFileDiscovery: false,
        },
        sendNotificationEmail: false, // Set this to true to send an email notification to the user
      });
    // console.log(res.data);
    console.log(`New doc created: https://docs.google.com/document/d/${newDocId}/edit`);

    //insert text into document
    await insertText(newDocId, prompt, essayBody, auth);

    //return an ID of newly created document
    return newDocId;
}

const insertText= async (DOCUMENT_ID, prompt="sample", essayBody="sample", auth) => {
    const docs = google.docs({ version: 'v1', auth });
  
    try {

      

    //   // Insert a heading
    //   const heading = "";
    //   await docs.documents.batchUpdate({
    //     documentId: DOCUMENT_ID,
    //     requestBody: {
    //       requests: [
    //         {
    //           insertText: {
    //             location: {
    //               index: 1, // Insert at the beginning of the document
    //             },
    //             text: `${heading}\n\n`,
    //           },
    //         },
    //       ],
    //     },
    //   });

      // Insert a paragraph
      const paragraph = `Prompt: The Importance of Writing Essays \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam nulla facilisi cras fermentum odio. Duis at tellus at urna condimentum mattis pellentesque id nibh. Nibh praesent tristique magna sit amet. Enim diam vulputate ut pharetra sit amet aliquam id diam. Egestas quis ipsum suspendisse ultrices gravida. Diam donec adipiscing tristique risus. Ornare quam viverra orci sagittis eu volutpat odio facilisis. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Eu facilisis sed odio morbi. Faucibus in ornare quam viverra orci sagittis eu volutpat odio. Bibendum est ultricies integer quis auctor elit sed. Sit amet consectetur adipiscing elit ut aliquam purus sit. Suspendisse potenti nullam ac tortor vitae purus. Id volutpat lacus laoreet non curabitur gravida.

      Nibh tellus molestie nunc non blandit. Dui nunc mattis enim ut. Tortor pretium viverra suspendisse potenti. Interdum consectetur libero id faucibus nisl tincidunt. Imperdiet massa tincidunt nunc pulvinar sapien. Et malesuada fames ac turpis egestas. Morbi tristique senectus et netus et malesuada fames ac turpis. Tristique nulla aliquet enim tortor at. Cras tincidunt lobortis feugiat vivamus at augue eget. Arcu non odio euismod lacinia at quis risus sed vulputate. Tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus. Accumsan tortor posuere ac ut consequat semper viverra nam libero. Egestas erat imperdiet sed euismod nisi. Nulla pharetra diam sit amet. Purus sit amet volutpat consequat mauris nunc congue nisi. Risus sed vulputate odio ut enim blandit volutpat. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Neque sodales ut etiam sit amet nisl purus in. Turpis egestas sed tempus urna et pharetra. Lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci.
      
      At in tellus integer feugiat scelerisque varius. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Elementum eu facilisis sed odio morbi quis commodo odio. Netus et malesuada fames ac turpis egestas maecenas. Hendrerit dolor magna eget est. Auctor neque vitae tempus quam pellentesque nec nam. Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed. Pretium nibh ipsum consequat nisl vel pretium. Praesent tristique magna sit amet purus. Aliquet sagittis id consectetur purus. Sociis natoque penatibus et magnis dis parturient montes nascetur. Commodo sed egestas egestas fringilla. Senectus et netus et malesuada fames ac. Iaculis at erat pellentesque adipiscing commodo. Vitae congue mauris rhoncus aenean vel elit scelerisque.
      
      Sed libero enim sed faucibus turpis in eu mi bibendum. Lobortis scelerisque fermentum dui faucibus. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Eu tincidunt tortor aliquam nulla facilisi. Ut eu sem integer vitae. Imperdiet dui accumsan sit amet nulla. Eget nulla facilisi etiam dignissim diam. Pharetra pharetra massa massa ultricies mi quis. Aliquam purus sit amet luctus venenatis. Ornare aenean euismod elementum nisi quis. Egestas congue quisque egestas diam in. Libero volutpat sed cras ornare arcu dui. Lorem ipsum dolor sit amet. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Massa eget egestas purus viverra accumsan in nisl. Dolor magna eget est lorem. Aliquet enim tortor at auctor urna nunc id cursus. Nec ullamcorper sit amet risus nullam eget felis eget nunc.
      
      Nunc pulvinar sapien et ligula ullamcorper malesuada. Bibendum neque egestas congue quisque egestas diam in arcu. Orci phasellus egestas tellus rutrum. Aliquet nec ullamcorper sit amet risus nullam eget. Diam sit amet nisl suscipit adipiscing bibendum. Velit ut tortor pretium viverra suspendisse. Arcu non odio euismod lacinia at quis risus sed vulputate. Phasellus vestibulum lorem sed risus ultricies. Pretium lectus quam id leo in vitae turpis. Tincidunt vitae semper quis lectus nulla at volutpat diam. Consectetur adipiscing elit duis tristique sollicitudin nibh sit. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Maecenas sed enim ut sem viverra aliquet eget sit amet. Nec ullamcorper sit amet risus nullam eget felis eget. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Suspendisse in est ante in nibh. Tellus id interdum velit laoreet id donec. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue.`;
      
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

    // Set the font for the entire document
    await docs.documents.batchUpdate({
        documentId: DOCUMENT_ID,
        requestBody: {
          requests: [
            {
              updateTextStyle: {
                range: {
                  startIndex: 1, // Start from index 1 (after the heading)
                  endIndex: 4493, // Set a large enough value to cover the entire document
                },
                textStyle: {
                  weightedFontFamily: {fontFamily: 'Comfortaa'}, // Set the font for the entire document
                  fontSize: {
                    magnitude: 11,
                    unit: 'PT',
                  },
                },
                fields: 'fontSize, weightedFontFamily', // Specify the fields to update
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

const SERVICE_ACCOUNT_KEY_PATH = './config/google-docs-service-account.json';

async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: SCOPES,
  });

  return auth.getClient();
}

const convertGoogleDocURL = async (googleDocId)=> {
    return `https://docs.google.com/document/d/${googleDocId}/edit`;
}


authorize().then(createDoc).catch(console.error);
authorize().then(printDocTitle).catch(console.error);

module.exports = {
  authorize,
  createDoc,
  printDocTitle, 
  convertGoogleDocURL
};
