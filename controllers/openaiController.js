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

  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: msg,
      to: `whatsapp:${phoneNumber}`,
    })
    .then((message) => console.log(message.sid));
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
    client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: msg,
      to: `whatsapp:${phoneNumber}`,
      mediaUrl: mediaUrl,
    })
    .then((message) => console.log(message.sid));
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
• sample improvement
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

const generateImage = async (prompt="University of British Columbia Campus") => {
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  return response.data.data[0].url;
};

module.exports = {
  sendMessage,
  simpleMessage,
  sendMediaMessage,
  generateResponse,
  generateImage
};
