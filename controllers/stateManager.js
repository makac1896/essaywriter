// const Essay = require("../models/essayModel");
// const State = require("../models/stateModel");
// const { simpleMessage, sendMediaMessage } = require("./openaiController");
// const {requestEssayFeedback}= require("../controllers/essayController");
// // const { sendMessage, simpleMessage } = require("../controllers/mainController")

// const processState = async (step, userMsg, phoneNumber)=>{
//     //check message state here
//     state = await State.findOne({phoneNumber});
  
//     if(!state){
//     //user does not have any registered state
//     state = new State({
//       phoneNumber,
//       state: {
//         step: "default state",
//         data:{},
//       }
//     })
//     };

//     console.log(state.step);

//     // Process user response based on the current step
//     switch (state.step) {
//         case `default state`:
//           await simpleMessage(phoneNumber, `*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title`);
//           state.step = "body-0";
  
//         //   await simpleMessage(phoneNumber, `*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title`);
//         //   await sendMediaMessage(phoneNumber, "Here is a free resource to get you started!", "https://jmc.msu.edu/_assets/pdfs/academics/writing%20consultancy/write-personal-statement.pdf")
//         return true;
//         case "body-0":
//             await simpleMessage(phoneNumber, `*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title`);
//           //introduction message and request essay title
//           state.data.prompt = userMsg;
//           state.step = "body-1";
//         case "body-1":
//           state.data.bodyOne = userMsg;
//           state.step = "body-2";
//           await simpleMessage(
//             phoneNumber,
//             "Kindly enter your first paragraph to get started! (max. 250 words)"
//           );
//           return true;
//           case "body-2":
//           state.data.bodyTwo = userMsg;
//           essay.state.step = "body-3";
//           await simpleMessage(
//             phoneNumber,
//             `Enter your *second* paragraph (max. *250 words*) \n\n If your essay has already been fully uploaded reply with a "."`
//           );
//           return true;
//         case "body-3":
//           essay.state.data.bodyThree = userMsg;
//           await simpleMessage(
//             phoneNumber,
//             `Enter your *third* paragraph (max. *250 words*) \n\n If your essay has already been fully uploaded reply with a "."`
//           );
          
//          state.step = "";
  
//           let body =
//             state.data.bodyOne +
//             "\n\n" +
//             state.data.bodyTwo +
//             "\n\n" +
//             state.data.bodyThree;
        
//         //request feedback for essay 
//         requestEssayFeedback(phoneNumber, body, state.data.prompt);

//         // const saveEssay = await Essay.create({
//         //     phoneNumber: phoneNumber,
//         //     essayTitle: state.data.prompt,
//         //     essayBody: body,
//         //   });

//         await state.save();
  
//           await simpleMessage(phoneNumber, "An essay review request has been sent out to mentors. You will receive confirmation shortly!");
//           return true;
//       }

//       await state.save();
// }

    
// module.exports = {
//   processState
// };

const Essay = require("../models/essayModel");
const State = require("../models/stateModel");
const { simpleMessage, sendMediaMessage, sendMessage, generateResponse } = require("./openaiController");
const { requestEssayFeedback } = require("../controllers/essayController");

const processState = async (userMsg, phoneNumber) => {
    // Check message state here
    var state = await State.findOne({ phoneNumber });

    console.log(state);

    if (!state) {
        console.log("executed");
        // User does not have any registered state
        state = new State({
            phoneNumber,
            state: {
                step: "default state",
                data: {},
            },
        });
    }

    //restart flow if user has submitted previous essay
    if(state.state.step==="" && userMsg.trim().toLowerCase()==="essay review"){
        state.state.step = "default state"
    }

    const stateID = state._id;
    console.log("State ID: " + stateID);


    console.log("Processor: " + state.state.step);

    // Process user response based on the current step
    if (state.state.step === "default state") {
        state.state.step = "body-0";
        console.log("Default state logger:" + state);
        try {
            const updatedState = await State.findByIdAndUpdate(stateID, { 'state.step': "body-0" });
            console.log("State update successful:", updatedState);
        } catch (error) {
            console.error("Failed to update state:", error);
        }
        
        await simpleMessage(phoneNumber, "*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title \n\n default state");
        // await simpleMessage(phoneNumber, `*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title`);
        // await sendMediaMessage(phoneNumber, "Here is a free resource to get you started!", "https://jmc.msu.edu/_assets/pdfs/academics/writing%20consultancy/write-personal-statement.pdf")
    } else if (state.state.step === "body-0") {
        await updateState(stateID, { 'state.step': "body-1", 'state.data.prompt': userMsg });
        await simpleMessage(phoneNumber, "*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title \n\n body-0 state");
        // Introduction message and request essay title
        // state.state.data.prompt = userMsg;
        // state.state.step = "body-1";
    } else if (state.state.step === "body-1") {
        await updateState(stateID, { 'state.step': "body-2", 'state.data.bodyOne': userMsg });
        await simpleMessage(
            phoneNumber,
            "Kindly enter your first paragraph to get started! (max. 250 words)"
        );
    } else if (state.state.step === "body-2") {
        await updateState(stateID, { 'state.step': "body-3", 'state.data.bodyTwo': userMsg });
        await simpleMessage(
            phoneNumber,
            `Enter your *second* paragraph (max. *250 words*) \n\n If your essay has already been fully uploaded reply with a "."`
        );
    }else if (state.state.step === "body-3") {
        await updateState(stateID, { 'state.step': "final", 'state.data.bodyThree': userMsg });
        await simpleMessage(
            phoneNumber,
            `Enter your *third* paragraph (max. *250 words*) \n\n If your essay has already been fully uploaded reply with a "."`
        ); 
        // await simpleMessage(phoneNumber, "An essay review request has been sent out to mentors. You will receive confirmation shortly!");
    }else if(state.state.step === "final"){
        await updateState(stateID, { 'state.step': "", 'state.data.bodyThree': userMsg });

        //combine paragraphs to one body
        let body = state.state.data.bodyOne + state.state.data.bodyTwo + state.state.data.bodyThree

        // Request feedback for essay
        requestEssayFeedback(phoneNumber, body, state.state.data.prompt);
        await sendMessage(phoneNumber,await generateResponse(`The following response length should be STRICTLY between 1000-1200 characters. Review this college essay written by a low-income student and provide feedback. Return detailed feedback in a easy-to-follow format with the most impactful points at the top of the list. Give specific examples where possible. Provide methods to implement the suggestions. Use appropriate text formatting and spacing for each major section. The feedback should identify key structural and thematic errors commonly found in essays written by low-income students without college counselling. Prompt: ${state.state.data.prompt} \n\n Body: ${body}`, "simple"));

    }
};

// function to update state
const updateState = async (objectID, requestBody)=>{
    try {
        const updatedState = await State.findByIdAndUpdate(objectID,requestBody);
        console.log("State Updated Successfully", objectID);
    } catch (error) {
        console.error("Failed to update state:", error);
    }
}

module.exports = {
    processState
};

