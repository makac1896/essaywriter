const { getResource } = require("../config/aws");
const { sendMessage, sendMediaMessage } = require("./openaiController");
const { generateResponse, generateImage } = require("./openaiController");
const Resource = require("../models/resourceModel");

// Define an empty state object to store the messages
let state = {};
const msgCodes=["brag sheet", "common app checklist", "common app guide", "css profile student", "css profile", "essay why us 2", "essay why us", "harvard guide", "lor teacher", "northwestern guide", "princeton checklist", "ubc guide"];

const createEssay = async (userMsg, phoneNumber) => {
  try {
    // Destructure phoneNumber
    phoneNumber = phoneNumber.split(":")[1];
    console.log(phoneNumber);

    // Retrieve the current state for the phoneNumber or initialize it if it doesn't exist
    let userState = state[phoneNumber] || {
      step: "intro",
      data: {},
    };

    console.log(userState.step);

    if (!userState.step || userState.step === "") {
      userState.step = "intro";
    }

    // Process user response based on the current step
    switch (userState.step) {
      case "intro":
        userState.data.prompt = userMsg;
        userState.step = "body-1";

        // Store the updated state for the phoneNumber
        state[phoneNumber] = userState;

        await sendMessage(phoneNumber,"Enter your first paragraph (max. 100 words)");
        break;
      case "body-1":
        userState.data.bodyOne = userMsg;
        userState.step = "body-2";

        // Store the updated state for the phoneNumber
        state[phoneNumber] = userState;

        await sendMessage(phoneNumber,"Enter your second paragraph (max. 100 words)");
        break;
      case "body-2":
        userState.data.bodyTwo = userMsg;
        userState.step = "body-3";

        // Store the updated state for the phoneNumber
        state[phoneNumber] = userState;

        await sendMessage(phoneNumber,"Enter your third paragraph (max. 100 words)");
        break;
      case "body-3":
        userState.data.bodyThree = userMsg;
        userState.step = "";

        // Store the updated state for the phoneNumber
        state[phoneNumber] = userState;

        let body =
          userState.data.bodyOne +
          "\n\n" +
          userState.data.bodyTwo +
          "\n\n" +
          userState.data.bodyThree;

        console.log("Essay Title: " + userState.data.prompt);
        console.log("Essay Body: " + body);

        let openaiMessage = await generateResponse(userMsg);
        console.log(userState.data);
        console.log(body);

        //send the response to user
        await sendMessage(phoneNumber, openaiMessage);
             

        await sendMediaMessage(phoneNumber,"Thank you for using our platform! \n Developed by: www.makatendekachikumbu.com/", "https://shorturl.at/gnCIP");
        break;
    }
  } catch (err) {
    console.log(err);
  }
};

//delay
async function serverDelay() {
    console.log(1);
    await sleep(1000);
    console.log(2);
}

const fileURLGenerator = async (msgCode) => {
  return `https://github.com/makac1896/collegeresources/blob/main/${msgCode.replaceAll(" ", "%20")}.pdf?raw=true`;
}
  
const logicHandler = async (msgCode, phoneNumber)=>{
  // Destructure phoneNumber
  phoneNumber = phoneNumber.split(":")[1];
  console.log(phoneNumber);

  //format user input
  msgCode = msgCode.toLowerCase().trim();
  console.log(msgCode);

  //check if the file exists in db
  let file = await Resource.findOne({
    "essayFiles.fileName":  msgCode
  });

  console.log(`File objects: ${file}`)

  // let fileExists = await Resource.

  if(file){
  //send file to user if it exists
    console.log("Activated Menu");
    // let resource = await getResource(msgCode);
    // console.log(resource);
    await sendMediaMessage(phoneNumber, msgCode, await fileURLGenerator(msgCode));
    // console.log(file.essayFiles);
    await sendMessage(phoneNumber,`_information related to your request_\n\n` + await generateResponse(`Write a file description for ${msgCode}`, "simple"));
    // await sendMessage(phoneNumber,`_information related to your request_\n\n` + await generateResponse(`Generate a pdf file description related to the following user request: `+ msgCode, "simple"));
  }else if(msgCode==="list schools")
  {
  //generate a menu and send it to user
    console.log("chibaba");

    let folders = await Resource.find({}, {objectName: 1});
    console.log(folders);

    let generatedMenu = `List of Supported Schools: \n\n`;

    await folders.forEach((folder, index) => {
      console.log(folder+ `-----`);
      generatedMenu += `${index+1}. *${folder.objectName}* \n`;
    });

    generatedMenu += `\n*To view a  folder, simply type the folder name. For example "Harvard folder"*\n\n Type *"list schools"* to view this list again!`
    
    await sendMessage(phoneNumber, generatedMenu);
  }
  else if (msgCode.toLowerCase().trim().split(" ").includes("folder")){
    // let AImessage = await generateResponse(msgCode, "simple");
    //   await sendMessage(phoneNumber,`_Your input was not recognised as a file request, please check your spelling._\n⚠️ ⚠️ ⚠️\n\nWe have redirected you to *dAVE*:\n\n` + AImessage);
    console.log("activated")
    // console.log(msgCode.toLowerCase().trim().split(" ").includes("folder"));
    // const imgURL = await generateImage(msgCode.toLowerCase().trim().split(" ")[0]);
    await sendMessage(phoneNumber, await generateMenu(msgCode));
}

  // switch (msgCode) {
  //   case "harvard ps":
  //     let resource = await getResource(msgCode);
  //     await sendMediaMessage(phoneNumber, "Harvard Personal Statement Guide", resource);
  //     await sendMessage(phoneNumber, "*Document Summary:* Harvard Common Application Guidelines");
  //     break;

  //   case "":
  //   default:
  //     let AImessage = await generateResponse(msgCode, "simple");
  //     await sendMessage(phoneNumber, AImessage);
  //     break;
  // }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

const generateMenu = async (msg)=>{
  //check if the file exists in db
  let files = await Resource.findOne({
    "objectName":  msg
  },
  {
    essayFiles: 1
  });

  if(files){
    let generatedMenu = `You are viewing results for: *${msg.toUpperCase()}* 📁 \n\n`;
  
  files.essayFiles.forEach(async (file, index) => {
    generatedMenu += `${index+1}. Name: _*${file.fileName.toLowerCase()}*_ \n-----\n Description: ${file.description} \n\n`;
  });

  console.log(generatedMenu);

  return generatedMenu +`\n\n 🐗: *_access a file by typing it's name_*`;
  }else{
    return `Your request: *${msg}*.\n\n Files found: 0 \n--------\n ⚙️ Looks like we don't have that file yet, we will add it soon! \n\n`;
  }

  
}

module.exports = {
    createEssay,
    logicHandler,
    serverDelay,
    fileURLGenerator
}

// // Example usage
// createEssay("Sample prompt", "12345"); // Simulate user input
// createEssay("First paragraph", "12345"); // Simulate user input
// createEssay("Second paragraph", "12345"); // Simulate user input
// createEssay("Third paragraph", "12345"); // Simulate user input
