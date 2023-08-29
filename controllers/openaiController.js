//Configurations
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//send a message
const sendMessage = async (
  phoneNumber = "",
  msg = "Hello, the server is starting..."
) => {
  // client.messages
  //   .create({
  //     from: "whatsapp:+14155238886",
  //     body: "*HIS Alumni Essay Assistant |* 🐬 \n",
  //     to:  "whatsapp:+12369939310",
  //   })
  //   .then((message) => console.log(message.sid));

  //for long messages
  if (msg.length > 1500) {
    //split message and then send it in segments
    let segments = checkResponseLength(msg, phoneNumber);
    await sendSegmentMessage(phoneNumber, segments);
    // client.messages
    //   .create({
    //     from: "whatsapp:+14155238886",
    //     body: `⏳ *Long Message Part 1.* \n--------\n\n ${segments[0]} \n\n 🌍 _response exceeds limit. to be continued in next message ..._`,
    //     to: `whatsapp:${phoneNumber}`
    //   })
    //   .then(async (message) => {
    //     await sendMessage(phoneNumber, `⏳ *Long Message Part 2.* \n--------\n\n ${segments[1]}`);
    //     console.log(message.sid)
    //   });
  } else {
    client.messages
      .create({
        from: "whatsapp:+14155238886",
        body: msg,
        to: `whatsapp:${phoneNumber}`,
      })
      .then((message) => console.log(message.sid));
  }
};

// //function to send segmented messages without messing up memory and cache
// const sendSegmentMessage = async(phoneNumber, segments)=> {
//     segments.forEach(async (segment, index)=>{
//       client.messages
//       .create({
//         from: "whatsapp:+14155238886",
//         body: `⏳ *Long Message Part ${index+1}.* \n--------\n\n ${segment}`,
//         to: `whatsapp:${phoneNumber}`
//       })
//       .then((message) => {
//         console.log(message.sid);
//       });
//     })
// }

const sendSegmentMessage = async (phoneNumber, segments) => {
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    try {
      const message = await client.messages.create({
        from: "whatsapp:+14155238886",
        body: `⏳ *Part ${index + 1}/${segments.length}* \n--------\n\n ${segment}`,
        to: `whatsapp:${phoneNumber}`,
      });
      console.log(message.sid);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};


//send media message
//send a message
const sendMediaMessage = async (
  phoneNumber = "",
  msg = "Hello, the server is starting...",
  mediaUrl = "https://demo.twilio.com/owl.png"
) => {
  // client.messages
  //   .create({
  //     from: "whatsapp:+14155238886",
  //     body: "*HIS Alumni Essay Assistant |* 🐬 \n",
  //     to:  "whatsapp:+12369939310",
  //   })
  //   .then((message) => console.log(message.sid));
  try {
    if (msg.length > 1500) {
      let segments = checkResponseLength(msg, phoneNumber);

      (await segments).forEach(async (msg, index) => {
        console.log(`Part ${index}/${segments.length()}. \n--------\n\n ${msg}`);
        // client.messages
        // .create({
        //   from: "whatsapp:+14155238886",
        //   body: msg,
        //   to: `whatsapp:${phoneNumber}`,
        //   mediaUrl: mediaUrl,
        // })
        // .then((message) => console.log(message.sid));
      });
    } else {
      client.messages
        .create({
          from: "whatsapp:+14155238886",
          body: msg,
          to: `whatsapp:${phoneNumber}`,
          mediaUrl: mediaUrl,
        })
        .then((message) => console.log(message.sid));
    }
  } catch (error) {
    console.log(error);
  }
};

//send a message
const simpleMessage = async (
  phoneNumber,
  msg = "Hello, the server is starting..."
) => {
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: msg,
      to: `whatsapp:${phoneNumber}`,
    })
    .then((message) => console.log(message.sid));
};

//openAI response
const generateResponse = async (prompt = "Hello", type = "essay") => {
  try {
    if (type === "simple") {
      const simplePrompt = prompt;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${simplePrompt}.`,
        temperature: 0.6, // Higher values means the model will take more risks.
        max_tokens: 400, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        top_p: 1, // alternative to sampling with temperature, called nucleus sampling
        frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });

      
      return `*You are talking to:* Dave \n _alumni@HIS_ \n\n *${response.data.choices[0].text}`;
    }

    const sampleResponse = `
    Rating: x\n\n
Breakdown:\n
• sample feedback point
\n\n
Suggested Improvements:\n 
• sample improvement point
    `;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt} (generate a title for the feedback and put it at the top of the response, be as critical as possible, give structured feedback to this personal essay for college admissions with bullet points and concise areas for improvement,at the very beginning rate the essay out of 5 and display the score out of 5, scores are as follows: 5-excellent, 4-good, 3-average, 2-lots of improvement needed, 1-extremely below expected standard, and provide a breakdown of this score, reference specific parts of the essay, keep it strictly around 150 words. strictly use bullet points for each feedback point, where possible include examples. here is an example of the expected output format: ${sampleResponse})`,
      temperature: 0.6, // Higher values means the model will take more risks.
      max_tokens: 800, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    console.log(typeof response.data.choices[0].text);
    // await simpleMessage("whatsapp:+12369939310","*HIS Alumni: College Essay Assistant* 🎯 \n")
    return (
      `*Early Development Feature ⚠️*\n----------\n` +
      response.data.choices[0].text
    );
  } catch (error) {
    simpleMessage(error);
    console.log(error);
  }
};

// const checkResponseLength = async (msg="")=>{
//   //split messages into segments of 1000 characters
//   let segments = msg.match(/.{1,1000}/g)

//   segments.forEach(async (msg, index) => {
//     await sendMessage(phoneNumber, `Long Message Part ${index+1}. \n\n ${msg}`);
//   })
// }

// const checkResponseLength = async (str,phoneNumber, maxLength = 1500) => {
//   if (str.length <= maxLength) {
//     return [str]; // No need to split, return the original string in an array
//   }

//   const wordRegex = /\b\w+\b/g;
//   const words = str.match(wordRegex); // Extract words from the string

//   const result = [];
//   let currentChunk = "";

//   for (const word of words) {
//     const newLength = currentChunk.length + word.length + 1; // Add 1 for the space between words
//     if (newLength <= maxLength) {
//       currentChunk += (currentChunk.length === 0 ? "" : " ") + word;
//     } else {
//       result.push(currentChunk);
//       currentChunk = word;
//     }
//   }

//   if (currentChunk.length > 0) {
//     result.push(currentChunk); // Add the last chunk to the result
//   }

//   return result;

//   result.forEach(async (msg, index) => {
//     console.log(
//       `Long Message Part ${index + 1}. \n--------\n\n ${msg}`
//     );
//   });
// };

const generateImage = async (
  prompt = "University of British Columbia Campus"
) => {
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  return response.data.data[0].url;
};

// function checkResponseLength (str, maxLength = 1500) {
//   if (str.length <= maxLength) {
//     return [str]; // No need to split, return the original string in an array
//   }

//   const index = str.lastIndexOf('\n', maxLength); // Find the most recent line break before maxLength

//   if (index === -1) {
//     // If there's no line break before maxLength, split at the maxLength
//     return [str.slice(0, maxLength), str.slice(maxLength)];
//   } else {
//     // Otherwise, split at the line break
//     return [str.slice(0, index), str.slice(index + 1)];
//   }
// }

// function checkResponseLength(str, maxLength = 1500) {
//   if (str.length <= maxLength) {
//     return [str]; // No need to split, return the original string in an array
//   }

//   const index = Math.max(str.lastIndexOf(' ', maxLength), str.lastIndexOf('\n', maxLength));
//   if (index === -1) {
//     // If there's no space or line break before maxLength, split at the maxLength
//     return [str.slice(0, maxLength), str.slice(maxLength)];
//   } else {
//     // Otherwise, split at the space or line break
//     return [str.slice(0, index), str.slice(index + 1)];
//   }
// }

function checkResponseLength(inputString) {
  const maxLength = 1000;
  const segments = [];

  let currentSegment = "";
  let lastLineBreakIndex = -1;
  for (let i = 0; i < inputString.length; i++) {
    currentSegment += inputString[i];

    if (inputString[i] === "***") {
      lastLineBreakIndex = i;
    }

    if (currentSegment.length >= maxLength) {
      if (lastLineBreakIndex === -1) {
        lastLineBreakIndex = i;
        // If no line break found, split at maxLength
      }

      segments.push(inputString.substring(0, lastLineBreakIndex + 1).trim());
      inputString = inputString.substring(lastLineBreakIndex + 1);
      currentSegment = "";
      lastLineBreakIndex = -1;
      i = 0;
      // Start over the loop with the remaining inputString
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment.trim());
  }

  return segments;
}

function getRandomElementFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Function to check if any object in the array matches the specified field and value
function checkArrayByField(arr, field, value) {
  return arr.some((obj) => obj[field] === value);
}




module.exports = {
  sendMessage,
  simpleMessage,
  sendMediaMessage,
  generateResponse,
  generateImage,
  getRandomElementFromArray,
  checkArrayByField
};
