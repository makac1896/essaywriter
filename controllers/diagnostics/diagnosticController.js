
const State = require("../../models/stateModel");
const Diagnostic = require("../../models/diagnosticModel");
const { simpleMessage, sendMediaMessage, sendMessage, generateResponse } = require("../openaiController");
const { requestEssayFeedback } = require("../essayController");
const { dialogflow } = require("googleapis/build/src/apis/dialogflow");

const generateDiagnosticReport = async (userMsg, phoneNumber) => {
    // Check message state here
    var state = await State.findOne({ phoneNumber });

    console.log(state);

    if (!state.diagnosticState || !state) {
        console.log("diagnostic executed");
        // User does not have any registered state
        state = new State({
            phoneNumber,
            diagnosticState: {
                step: "default state diagnostic",
                data: {},
            },
        });
    }

    //restart flow if user has submitted previous essay
    if(state.diagnosticState.step==="diagnostic-final" && userMsg.trim().toLowerCase()==="doctor dave"){
        state.diagnosticState.step = "default state diagnostic"
    }

    const stateID = state._id;
    console.log("State ID: " + stateID);


    console.log("Processor: " + state.diagnosticState.step);

    // Process user response based on the current step
    if (state.diagnosticState.step === "default state diagnostic") {
        state.diagnosticState.step = "body-0 diagnostic";
        console.log("Default state logger:" + state);
        try {
            const updatedState = await State.findByIdAndUpdate(stateID, { 'diagnosticState.step': "body-0 diagnostic" });
            console.log("State update successful:", updatedState);
        } catch (error) {
            console.error("Failed to update state:", error);
        }
        
        await simpleMessage(phoneNumber, `🔍 Hey there! *I'm Athena* 🧙‍♀️, your guide on this exciting journey. 🌟 \n\n

        We're here to make your life easier! We'll ask you some questions to get to know you better and help you find the perfect resources. 🚀\n\n
        
        Ready to start? Just drop the *names of the countries* you're applying to below in a comma seperated list! 🌍📝 \n\n
        
        _e.g United States, Canada, United Kingdom, South Africa_`);
        // await simpleMessage(phoneNumber, `*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title`);
        // await sendMediaMessage(phoneNumber, "Here is a free resource to get you started!", "https://jmc.msu.edu/_assets/pdfs/academics/writing%20consultancy/write-personal-statement.pdf")
    } else if (state.diagnosticState.step === "body-0 diagnostic") {
        await updateState(stateID, { 'diagnosticState.step': "body-1 diagnostic", 'diagnosticState.data.countryList': userMsg });
        await simpleMessage(phoneNumber, `*Question 1/4:* \n\n🔍 Hey there! *Athena* again 🧙‍♀️🌟 \n\n*Academic, Personal and Professional Interests*\n\n_What are your favorite subjects or areas of study in school?_ 📝 \n\n_Do you have any specific career aspirations or hobbies?_ 📝 \n\n_Respond with a comma seperated list of your interests._ \n\n _e.g Physics, Chemistry, Math, Dance, Coding, Volunteering_`);
        // Introduction message and request essay title
        // state.state.data.prompt = userMsg;
        // state.state.step = "body-1";
    } else if (state.diagnosticState.step === "body-1 diagnostic") {
        await updateState(stateID, { 'diagnosticState.step': "body-2 diagnostic", 'diagnosticState.data.academicAndProfessionalInterests': userMsg });
        await simpleMessage(phoneNumber, `*Question 2/4:* \n\n🔍 Hey there! _Athena_ again 🧙‍♀️🌟 \n\n*Challenges and Goals*\n\nℹ️: Use this response to respond to one or both of these questions 👇🏿 \n\n_Are there any specific academic challenges you've faced or goals you'd like to achieve during the college application process?_ 📝 \n\n_Are there any financial constraints or concerns about affording the college application process?_ \n\n_Free response question *Max. 100 words*_`);
    } else if (state.diagnosticState.step === "body-2 diagnostic") {
        await updateState(stateID, { 'diagnosticState.step': "body-3 diagnostic", 'diagnosticState.data.challenges': userMsg });
        await simpleMessage(phoneNumber, `*Question 3/4:* \n\n🔍 We're almost there! \n\n*Introduce yourself*\n\n_Do you have any *creative talents, hobbies or passions* you'd like to share?_\n\nUse this response to share *ANYTHING* you would like our team to know about you!\n\n_*50-100 words*_`);
    }else if (state.diagnosticState.step === "body-3 diagnostic") {
        await updateState(stateID, { 'diagnosticState.step': "diagnostic final", 'diagnosticState.data.introduction': userMsg });
        await simpleMessage(phoneNumber, `*Question 4/4:* \n\n🔍 You made it! ~*Athena* 🧙‍♀️🌟 \n\n*Time Management & Commitments*\n\n_Do you have any part-time jobs, non-school commitments or family responsibilities that may affect your college preparation?_ 📝 \n\n_*50-100 words*_`);
        // await simpleMessage(phoneNumber, "An essay review request has been sent out to mentors. You will receive confirmation shortly!");
    }else if(state.diagnosticState.step === "diagnostic final"){
        await updateState(stateID, { 'diagnosticState.step': "diagnostic-final", 'diagnosticState.data.commitments': userMsg });

        //combine paragraphs to one body
        let body = new Diagnostic({
            studentPhoneNumber: phoneNumber,
            academicInterests: state.diagnosticState.data.academicAndProfessionalInterests.split(","),
            countryList: state.diagnosticState.data.countryList.split(","),
            challenges: state.diagnosticState.data.challenges,
            introduction: state.diagnosticState.data.introduction,
            commitments: state.diagnosticState.data.commitments
        });
          
        await body.save()
        // console.log(body);

        // const academicInterests=  await generateObject(`Return an array of strings with a list of academic interests that the student seems to be interested in. Here is their description of their interests: ${body.academicInterests}`);
        // console.log(academicInterests);

        // Request feedback for essay
        // requestEssayFeedback(phoneNumber, body, state.diagnosticState.data.prompt);
        await sendMessage(phoneNumber,await generateResponse(`Provide a short summary of this student using the following info. Here is the JSON object of the student's info:${body}`, "simple"));

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
    generateDiagnosticReport
};

