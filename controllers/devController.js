const { getResource } = require("../config/aws");
const State = require("../models/stateModel");
const {processState} = require("../controllers/stateManager");
const { sendMessage, sendMediaMessage } = require("./openaiController");
const { generateResponse, generateImage, getRandomElementFromArray, checkArrayByField } = require("./openaiController");
const Resource = require("../models/resourceModel");
const { registerUser } = require("../controllers/functions/registerStudent");
const { getCareerMentors } = require("./careerController");
const CareerMentor = require("../models/careerMentorModel");

//diagnostics
const {generateDiagnosticReport} = require("./diagnostics/diagnosticController")

//google APIs
const {  authorize, createDoc, printDocTitle, convertGoogleDocURL } = require("../config/google");
const { listSchools, getAmbassadors, elementExistsInBothArrays, hasMultipleCommonElements } = require("./ambassadorController");

// Define an empty state object to store the messages
let state = {};

//devConstants
const msgCodes = [
  "brag sheet",
  "common app checklist",
  "common app guide",
  "css profile student",
  "css profile",
  "essay why us 2",
  "essay why us",
  "harvard guide",
  "lor teacher",
  "northwestern guide",
  "princeton checklist",
  "ubc guide",
];
const schools = [
  "Amherst",
  "Brandeis",
  "Barnard",
  "Brown",
  "Bucknell",
  "Claremont",
  "Colgate",
  "Emory",
  "LeHigh",
  "MIT",
  "Pomona",
  "Reed",
  "Rice",
  "Richmond",
  "Rochester",
  "Swarthmore",
  "Tufts",
  "UChicago",
  "NotreDame",
  "UWM",
  "Vanderbilt",
  "Vassar",
  "WashU",
  "Wellesley",
  "Columbia",
  "Cornell",
  "Dartmouth",
  "Harvard",
  "Northwestern",
  "Princeton",
  "Stanford",
  "Swarthmore",
  "Upenn",
  "Yale",
];
const universityEmojis = [
  "🎓", // Graduation Cap
  "📚", // Books
  "🏫", // School
  "🎒", // Backpack
  "📝", // Memo
  "⭐", //Star
  "🏛️", // Classical Building
  "🎉", // Party Popper (celebrating graduation)
  "📅", // Calendar (for marking important dates)
  "📖", // Open Book
  "✏️", // Pencil
  "🔬", // Microscope
  "🧪", // Test Tube
  "🗞️", // Rolled-Up Newspaper (representing campus news)
  "👩‍🎓", // Woman Student (representing students)
];
//common greetings to get dave started
const greetings = [
  "hi dave",
  "hey dave",
  "hello dave",
  "yo dave",
  "howdy dave",
  "hiya dave",
  "heyy dave",
  "heyyy dave",
  "heyyyy dave",
  "hi there dave",
  "hello there dave",
  "hey there dave",
  "yo there dave",
  "sup dave",
  "heya dave",
  "hola dave",
  "greetings dave",
  "hi dave!",
  "hey dave!",
  "hello dave!",
  "yo dave!",
  "howdy dave!",
  "hiya dave!",
  "heyy dave!",
  "heyyy dave!",
  "heyyyy dave!",
  "hi there dave!",
  "hello there dave!",
  "hey there dave!",
  "yo there dave!",
  "sup dave!",
  "heya dave!",
  "hola dave!",
  "greetings dave!",
  "hi there, dave!",
  "hello there, dave!",
  "hey there, dave!",
  "hi dave :)",
  "hey dave :)",
  "hello dave :)",
  "yo dave :)",
  "howdy dave :)",
  "hiya dave :)",
  "heyy dave :)",
  "hi dave, how's it going?",
  "hey dave, how are you?",
  "hello dave, what's up?",
  "hi dave, long time no see!",
  "hey there dave, fancy meeting you here!",
  "yo dave, ready to chat?",
  "hi",
  "hello",
  "hey",
  "yo",
  "hi!",
  "hello!",
  "hey!",
  "yo!",
  "hi there",
  "hello there",
  "hey there",
  "yo there",
  "hiya",
  "heyy",
  "hi everyone",
  "hello everyone",
];

const videos = [
  {title: "EPISODE 1: My Essay Sucks w/Jeremy | HIS Alumni Mentorship Program 22-23", url: "https://youtu.be/k-cReCHylHk", msgCode: "episode 1"}, // Episode 1
  {title: "EPISODE 2: The College Application w/Jeremy | HIS Alumni Mentorship Program 22-23", url: "https://youtu.be/SXCJrvN8gVo", msgCode: "episode 2"}, // Episode 2
  {title: "EPISODE 3: Personal Branding w/Makatendeka Chikumbu | HIS Alumni Mentorship Program 22-23", url: "https://youtu.be/WYJJkLr9jxY", msgCode: "episode 3"}, // Episode 3
  {title: "EPISODE 4: Building YOUR Brand w/ Makatendeka Chikumbu | HIS Alumni Mentorship Program 22-23", url: "https://youtu.be/LwB5drF1OkM", msgCode: "episode 4"}, // Episode 4
  {title: "EPISODE 5: Why US? w/ Kuziva Mavera | HIS Alumni Mentorship Program 22-23", url: "https://youtu.be/yf2GWaxqFM4", msgCode: "episode 5"}, // Episode 5
  {title: "EPISODE 6: The Personal Statement w/ Mike Masamvu | HIS Alumni Mentorship Program 22-23", url: "https://youtu.be/GL9xmIvuh4g", msgCode: "episode 6"} // Episode 6
]

//essay requests 
const createNewEssayRequest = async (userMsg, phoneNumber)=>{

  try {
  //deconstruct message to get the essay
  let processedUserMsg = userMsg.split("🇿🇼") // Message will be in this format: request#prompt#feedback_email#essay_body
  
  //check if message is formatted correctly
  if(processedUserMsg.length===4){
    //all data is present
    var msgRequest = processedUserMsg[0];
    var prompt = processedUserMsg[1];
    var studentEmail = processedUserMsg[2];
    var essayBody = processedUserMsg[3];

    //check if the msgRequest is correct
    if(msgRequest.trim().toLowerCase()==="review request"){
      //user selected essay request

      //generate AI feedback
      let AIresponse = await generateResponse(`Essay Prompt: ${prompt} \n Essay Body: ${essayBody}`);

      //create google doc to store essay


    }
  }{
    //missing data \\ ask user to review their message
    await sendMessage(phoneNumber, "💡 It appears your message is not correctly formatted, we are developing a better input process but for now please bear with us. \n Please check your message is formatted properly and resubmit your request 💡");
  }
  } catch (error) {
    await sendMessage(phoneNumber, error);
    return error;
  }

}

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

        await sendMessage(
          phoneNumber,
          "Enter your first paragraph (max. 100 words)"
        );
        break;
      case "body-1":
        userState.data.bodyOne = userMsg;
        userState.step = "body-2";

        // Store the updated state for the phoneNumber
        state[phoneNumber] = userState;

        await sendMessage(
          phoneNumber,
          "Enter your second paragraph (max. 100 words)"
        );
        break;
      case "body-2":
        userState.data.bodyTwo = userMsg;
        userState.step = "body-3";

        // Store the updated state for the phoneNumber
        state[phoneNumber] = userState;

        await sendMessage(
          phoneNumber,
          "Enter your third paragraph (max. 100 words)"
        );
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

        await sendMediaMessage(
          phoneNumber,
          "Thank you for using our platform! \n Developed by: www.makatendekachikumbu.com/",
          "https://shorturl.at/gnCIP"
        );
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

//to request essay files
const fileURLGenerator = async (msgCode) => {
  return `https://github.com/makac1896/collegeresources/blob/main/essays/${msgCode.replaceAll(
    " ",
    "%20"
  )}.pdf?raw=true`;
};

//request financial aid files
const aidURLGenerator = async (msgCode) => {
  console.log(
    `https://github.com/makac1896/collegeresources/blob/main/aid/${msgCode.replaceAll(
      " ",
      "%20"
    )}.pdf?raw=true`
  );
  return `https://github.com/makac1896/collegeresources/blob/main/aid/${msgCode.replaceAll(
    " ",
    "%20"
  )}.pdf?raw=true`;
};

const logicHandler = async (msgCode, phoneNumber) => {
  // Destructure phoneNumber
  phoneNumber = phoneNumber.split(":")[1];
  console.log(phoneNumber);

  //format user input
  msgCode = msgCode.toLowerCase().trim();
  console.log(msgCode);

  //split user message if necessary
  var msgRequest = msgCode.split("🇿🇼")[0]; //check for special message requests

  //check if user searched specific career mentor
  //check for a financial aid file in db
  const SearchCareerMentor = await CareerMentor.findOne({
    accessCode: msgCode
  });

  //check if the file (essay) exists in db
  let file = await Resource.findOne({
    "essayFiles.fileName": msgCode,
  });

  //check for a financial aid file in db
  let aid = await Resource.findOne({
    objectName: "aid folder",
    essayFiles: { $elemMatch: { fileName: msgCode } },
  });

  console.log(`File objects: ${file}`);

  //check if its a financial aid request
  if (aid) {
    console.log("FINANCIAL AID REQUEST");
    //send financial aid documents to user
    await sendMediaMessage(
      phoneNumber,
      msgCode,
      await aidURLGenerator(msgCode)
    );
    // console.log(file.essayFiles);
    await sendMessage(
      phoneNumber,
      `⭐ _information related to your request_\n\n` +
        (await generateResponse(
          `Write a witty file description for a file named "${msgCode}". Keep it less than 100 words.`,
          "simple"
        ))
    );

    //if a financial aid file is returned, disable request for essay files
    return (file = false);
  }

  if (file) {
    //send file to user if it exists
    console.log("Activated Menu");
    // let resource = await getResource(msgCode);
    // console.log(resource);
    await sendMediaMessage(
      phoneNumber,
      msgCode,
      await fileURLGenerator(msgCode)
    );
    // console.log(file.essayFiles);
    await sendMessage(
      phoneNumber,
      `⭐ _information related to your request_\n\n` +
        (await generateResponse(
          `Write a witty file description for a file named "${msgCode}". Keep it less than 100 words.`,
          "simple"
        ))
    );
    // await sendMessage(phoneNumber,`_information related to your request_\n\n` + await generateResponse(`Generate a pdf file description related to the following user request: `+ msgCode, "simple"));
  }else if(msgCode==="essay review"){
    //user begins essay review process here
    // userState.state.step = "default state";
    // await processState(userState.state.step, msgCode, phoneNumber);
  } 
  else if(msgCode==="skip"){
    //do nothing and wait for next request
    console.log("Skip logic")
  } 
  else if (msgCode === "list schools") {
    //generate a menu and send it to user
    console.log("chibaba");

    let folders = await Resource.find({}, { objectName: 1 });
    // console.log(folders);

    let generatedMenu = `🌎 *List of Supported Schools:* \n\n`;

    // const folderNames = folders.map(folder=>folder.objectName);
    // console.log(folderNames);

    //print menu
    schools.sort().forEach((folder, index) => {
      // console.log(folder+ `-----`);
      generatedMenu += `\n ${getRandomElementFromArray(universityEmojis)} *${folder}* \n`;

      // generatedMenu += `🏫 *${folder} Folder* \n 🔗 Quick Link: https://wa.me/+14155238886?text=${folder}%20folder \n\n`;
    });

    generatedMenu += `\nTo view a folder, type: '_school + folder_' \n\n 🔎 Sample request: *harvard folder*\n\n _*View list again*_: 🔗 https://wa.me/+14155238886?text=list%20schools \n\n 🌐 _Additional Schools w/ Financial Aid for African Students_: *https://shorturl.at/oQTVZ*`;

    const url = "https://i.imgur.com/qCQsx9t.png";
    await sendMediaMessage(phoneNumber, generatedMenu, url);
  } else if (msgCode === "list aid") {
    //generate financial aid menu
    await sendMessage(
      phoneNumber,
      `_a quick message from Dave:_\n*\n\n Alright, my fellow African students, listen up! This scholarship list is like the cheat code to unlock the secret level of education! It won't make you a superhero, but hey, knowledge is power – and that's pretty darn close! So grab your capes and get ready to soar to new academic heights! You got this! 🚀📚💪 \n\n @hisalumni`
    );
    await sendMessage(phoneNumber, await generateAidMenu("aid folder", phoneNumber));
  } else if (msgCode.toLowerCase().trim().split(" ").includes("folder")) {
    // let AImessage = await generateResponse(msgCode, "simple");
    //   await sendMessage(phoneNumber,`_Your input was not recognised as a file request, please check your spelling._\n⚠️ ⚠️ ⚠️\n\nWe have redirected you to *dAVE*:\n\n` + AImessage);
    console.log("activated");
    // console.log(msgCode.toLowerCase().trim().split(" ").includes("folder"));
    const imgURL = await generateImage(
      `Generate a van gogh style painting of a university campus`
    );
    // await sendMediaMessage(phoneNumber, `University Campus for: ${msgCode.toLowerCase().trim().split(" ")[0]}}`, imgURL);
    await sendMessage(phoneNumber, await generateMenu(msgCode, phoneNumber));
  } else if (greetings.includes(msgCode.toLowerCase().trim())) {
    const url =
      "https://i.imgur.com/AOnCRqF.png";
    await sendMediaMessage(
      phoneNumber,
      `Welcome to HIS Alumni! We strive to make your College process smoother, meet *dAVE*\n\n Our newest digital assistant to help you at every stage of the College process! \n\n _Built with passion, fueled by ambition!_ \n\n ⭐ Type _*quick start*_ to get started!`,
      url
    );  
  } else if(msgCode==="quick start"){
    const url = "https://i.imgur.com/RsFiGWk.png";
    await sendMediaMessage(
      phoneNumber,
      `*Quick Start Menu 🚀* \n\n 1. Type _*list schools*_ to view essay resources 📑 \n\n 2. Type _*list aid*_ to access financial aid resources 💸 \n\n 3. Type _*blog menu*_ to access our blog 📚 \n\n 4. Type _*video menu*_ to access Video resources 📽️\n\n 5. Type _*view ambassadors*_ to access Mentor profiles \n\n 6. Type _*essay review*_ to request essay feedback _(beta)_ 🚧`,
      url
    );
  }else if(checkArrayByField(videos, "msgCode", msgCode)){
    const video = videos.filter(video=>video.msgCode===msgCode) // returns the correct episode
    const caption = `🎯 This video is part of our Mentorship Series for the 22-23 Academic Year.`;

    await sendMessage(phoneNumber, `*${video[0].title}* \n\n ${caption} \n\n ${video[0].url}`);
  }else if(msgCode==="video menu"){
    const msg = await generateVideoMenu();
    const url = "https://i.imgur.com/AOnCRqF.png";
    await sendMediaMessage(phoneNumber, msg, url);
  }
  //special system messages are processed here
  else if (msgCode.trim().toLowerCase()==="review request"){
    //call review function and print error if neccessary
      await createNewEssayRequest(msgCode, phoneNumber).catch(err => console.log(err));
  }
  //trigger the connect function and sent to controller for this function
  else if(msgCode.split(" ")[0]==="connect" && msgCode.split(" ")[1]==="student"){
    //send request to Ambassador Controller
    const templateMsg =  `*Important Communication Guidelines* 🌟\n\n
⭐ _*Respect Mentor's Time:*_\n Our mentors are very busy, and responses can take *up to 72 hours.* Please be patient and respectful of their time. \n\n
⭐ _*Introduction:*_\n In your first message, introduce yourself briefly. Mention your name, your current academic or career stage, and the specific reason you're reaching out for guidance. \n\n
⭐ _*Source of Contact:*_\n Clearly state that you got the mentor's contact via Dave, the HIS Alumni mentoring platform. This helps mentors understand the context of your message. \n\n
⭐ _*Professional Tone:*_\n Maintain a professional and courteous tone in all your messages. Address mentors with respect and gratitude for their assistance. \n\n
⭐ _*Concise Communication:*_\n Keep your messages clear and concise. State your questions or requests succinctly to make it easier for mentors to provide valuable guidance. \n\n
Remember that our mentors are here to help you succeed, and following these guidelines will ensure effective and respectful communication. Good luck with your mentoring journey! 🚀`

    await sendMessage(phoneNumber, templateMsg);       
    await getAmbassadors(phoneNumber, msgCode.split(" ")[3]);
  }
  else if(msgCode==="view ambassadors"){
    //send list of ambassadors
    await listSchools(phoneNumber);
  }
  //check if student has requested to view a mentor profile
  else if(msgCode.toLowerCase().trim().split(" ").includes("view") && msgCode.toLowerCase().trim().split(" ").includes("ambassadors") && hasMultipleCommonElements(schools, msgCode.trim().split(" "))){
    console.log('It works');
    await sendMessage(phoneNumber, 'It works!');
  }
  //career mentors section
  else if(msgCode==="view career mentors"){
    //send list of career mentors
    await getCareerMentors(phoneNumber);
  }
  //if user searched up a specific career mentor
  else {
    // await sendMessage(
    //   phoneNumber,
    //   `Your request: *${msgCode}*\n\n Files found: 0 \n--------\n ⚙️ Looks like we don't have that file yet, we will add it soon! \n\n ⭐ *Remember to double check your spelling :)*`
    // );

    //Disable for Development Only
    // let AImessage = await generateResponse(`Respond to this in an informative and concise way: ${msgCode}`, "simple");
    // await sendMessage(phoneNumber,`_Your input was not recognised as a file request, please check your spelling._\n⚠️ ⚠️ ⚠️\n\nWe have redirected you to *dAVE*:\n\n` + AImessage);
  }

    //check message state here
    var userState = await State.findOne({phoneNumber});
  
    if(!userState){
      //user does not have any registered state
      userState = new State({
        phoneNumber,
        state: {
          step: "default state",
          data:{},
        }
      })
      console.log("no state exists")
    }else{
      console.log(userState.state);
      console.log("state exists")
    }
  
    //pre-processing state
    await userState.save().then(console.log(userState))
  
    console.log(`CURRENT STATE: `+ userState.state.step);
  
    //call state function to process and execute appropriate logic
    await registerUser(msgCode, phoneNumber);
    await processState(msgCode, phoneNumber);
    await generateDiagnosticReport(msgCode, phoneNumber);

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
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//generate menu for videos
const generateVideoMenu = async () => {
  //generate video menu
    let generatedMenu = `You are viewing results for: *Studio Files* 📁 \n\n`;

    videos.forEach(async (video, index) => {
      generatedMenu += `_*${video.title}*_
      \n🔗: https://wa.me/+14155238886?text=${video.msgCode.toLowerCase().replaceAll(" ", "%20")}\n\n`;
    });

    console.log(generatedMenu);

    return generatedMenu + `\n\n 🐗: *_click link to access video_*`;
};



const generateAidMenu = async (msg, phoneNumber="+12369939310") => {
  //check if the file exists in db
  let files = await Resource.findOne(
    {
      objectName: "aid folder",
    },
    {
      essayFiles: 1,
    }
  );

  if (files) {
    let generatedMenu = `You are viewing results for: *${msg.toUpperCase()}* 📁 \n\n`;

    files.essayFiles.forEach(async (file, index) => {
      generatedMenu += `\n${
        index + 1
      }. Name: _*${file.fileName.toLowerCase()}*_ \n-----\n Description: ${
        file.description
      } \n🔗: https://wa.me/+14155238886?text=${file.fileName.toLowerCase().replaceAll(" ", "%20")}\n\n ***`;
    });

    console.log(generatedMenu);

    return generatedMenu + `\n\n 🐗: *_access a file by typing it's name_*`;
  } else {
    return `Your request: *${msg}*.\n\n Files found: 0 \n--------\n ⚙️ Looks like we don't have that file yet, we will add it soon! \n\n`;
  }
};

const generateMenu = async (msg, phoneNumber) => {
  //check if the file exists in db
  let files = await Resource.findOne(
    {
      objectName: msg,
    },
    {
      essayFiles: 1,
    }
  );

  if (files) {
    let generatedMenu = `You are viewing results for: *${msg.toUpperCase()}* 📁 \n\n`;

    files.essayFiles.forEach(async (file, index) => {
      generatedMenu += `${
        index + 1
      }. Name: _*${file.fileName.toLowerCase()}*_ \n-----\n Description: ${
        file.description
      } \n\n🔗 Quick Link: https://wa.me/+14155238886?text=${file.fileName.toLowerCase().replaceAll(" ", "%20")}\n\n`;
    });

    console.log(generatedMenu);

    return generatedMenu + `\n\n 🐗: *_access a file by typing it's name_*`;
  } else {
    return `Your request: *${msg}*.\n\n Files found: 0 \n--------\n ⚙️ Looks like we don't have that file yet, we will add it soon! \n\n`;
  }
};

module.exports = {
  createEssay,
  logicHandler,
  serverDelay,
  fileURLGenerator,
};

// // Example usage
// createEssay("Sample prompt", "12345"); // Simulate user input
// createEssay("First paragraph", "12345"); // Simulate user input
// createEssay("Second paragraph", "12345"); // Simulate user input
// createEssay("Third paragraph", "12345"); // Simulate user input
