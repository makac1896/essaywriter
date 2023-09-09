const Student = require("../../models/studentModel");
const State = require("../../models/stateModel");
const {
  simpleMessage,
  sendMediaMessage,
  sendMessage,
  generateResponse,
} = require("../../controllers/openaiController");
const { requestEssayFeedback } = require("../../controllers/essayController");

const registerUser = async (userMsg, phoneNumber) => {
  // Check message state here
  var state = await State.findOne({ phoneNumber });

  // console.log(state);

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

  var checkStudent = await Student.findOne({ phoneNumber });

  if (checkStudent) {
    await simpleMessage(
      phoneNumber,
      "Our records show you are already registered, however we allow more than one student to use a phonenumber."
    );
  }

  //restart flow if user has submitted previous essay
  if (
    state.state.step === "" &&
    userMsg.trim().toLowerCase() === "register student"
  ) {
    state.state.step = "default state register";
  }

  const stateID = state._id;
  // console.log("State ID: " + stateID);

  // console.log("Processor: " + state.state.step);

  // Process user response based on the current step
  if (state.state.step === "default state register") {
    state.state.step = "name register";
    // console.log("Default state logger:" + state);
    try {
      const updatedState = await State.findByIdAndUpdate(stateID, {
        "state.step": "name register",
      });
      // console.log("State update successful:", updatedState);
    } catch (error) {
      console.error("Failed to update state:", error);
    }

    await simpleMessage(
      phoneNumber,
      "*Hi, welcome to Dave's Registration Form* \n\n Please enter your fullname \n\n name"
    );
    // await simpleMessage(phoneNumber, `*Welcome to our new Essay Review Process* \n\n Enter the Essay Prompt/Title`);
    // await sendMediaMessage(phoneNumber, "Here is a free resource to get you started!", "https://jmc.msu.edu/_assets/pdfs/academics/writing%20consultancy/write-personal-statement.pdf")
  } else if (state.state.step === "name register") {
    await updateState(stateID, {
      "state.step": "schools register",
      "state.registrationState.studentName": userMsg,
    });
    await simpleMessage(
      phoneNumber,
      "*Please enter a comma separated list of all the schools you are interested in applying to* \n\n e.g _UBC, Princeton, Harvard, MIT_ \n\n schools register"
    );
  } else if (state.state.step === "schools register") {
    await updateState(stateID, {
      "state.step": "currentEducation register",
      "state.registrationState.schools": userMsg,
    });
    await simpleMessage(phoneNumber, "What is your current education level?");
  } else if (state.state.step === "currentEducation register") {
    await updateState(stateID, {
      "state.step": "studentEmail register",
      "state.registrationState.currentEducation": userMsg,
    });
    await simpleMessage(
      phoneNumber,
      `Please enter an email address you have access to frequently. \n\n Sometimes Mentors may contact you via email, so enter an address you check regularly.`
    );
  } else if (state.state.step === "studentEmail register") {
    await updateState(stateID, {
      "state.step": "final register",
      "state.registrationState.studentEmail": userMsg,
    });
    await simpleMessage(
      phoneNumber,
      `Are these details correct? \n\n Name: ${state.state.registrationState.studentName} \n\n Email: ${state.state.registrationState.studentEmail} \n\n Reply with YES or NO.`
    );
    // await simpleMessage(phoneNumber, "An essay review request has been sent out to mentors. You will receive confirmation shortly!");
  } else if (state.state.step === "final register") {
    await updateState(stateID, { "state.step": "" });

    //check if the student is already registered
    const checkStudent = await Student.findOne({
      studentPhoneNumber: phoneNumber,
    });

    if (!checkStudent) {
      //add user details to database
      const newStudent = new Student({
        studentPhoneNumber: phoneNumber,
        studentName: state.state.registrationState.studentName,
        schools: await state.state.registrationState.schools.split(","), //convert csv list to array
        currentEducation: state.state.registrationState.currentEducation,
        studentEmail: state.state.registrationState.studentEmail,
      });

      await simpleMessage(
        phoneNumber,
        `That's it, Welcome to the Dave community ${state.state.registrationState.studentName}!`
      );

      //commit changes to database
      await newStudent
        .save()
        .then(
          simpleMessage(phoneNumber, "You have been added to our database!")
        );
    } else {
      await simpleMessage(
        phoneNumber,
        "You appear to already have an account with us!"
      );
    }

    // await simpleMessage(phoneNumber, `Welcome to the Dave Community, ${state.registrationState.studentName}`);
  }
};

// function to update state
const updateState = async (objectID, requestBody) => {
  try {
    const updatedState = await State.findByIdAndUpdate(objectID, requestBody);
    // console.log("State Updated Successfully", objectID);
  } catch (error) {
    console.error("Failed to update state:", error);
  }
};

module.exports = {
  registerUser,
};
