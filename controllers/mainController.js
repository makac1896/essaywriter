const Essay = require("../models/essayModel");
const { simpleMessage, sendMediaMessage } = require("./openaiController");
// const { sendMessage, simpleMessage } = require("../controllers/mainController")

const createEssay = async (userMsg, phoneNumber) => {
  try {
    //destructure phoneNumber
    phoneNumber = phoneNumber.split(":")[1];
    console.log(phoneNumber);

    // Retrieve or initialize user state from the database
    let essay = await Essay.findOne({ phoneNumber });

    if (!essay) {
      essay = new Essay({
        phoneNumber,
        state: {
          step: "intro",
          data: {},
        },
      });
    }else{
        console.log(essay);
    }

    if (essay.state.step == null || essay.state.step === "") {
      essay.state.step = "intro";
      
    }

    // Process user response based on the current step
    switch (essay.state.step) {
      case "intro":
        essay.state.data.prompt = userMsg;
        essay.state.step = "body-1";

        await simpleMessage(phoneNumber, "Enter the Essay Prompt");
        await sendMediaMessage(phoneNumber, "Here is a free resource to get you started!", "https://jmc.msu.edu/_assets/pdfs/academics/writing%20consultancy/write-personal-statement.pdf")
        break;
      case "body-1":
        essay.state.data.bodyOne = userMsg;
        essay.state.step = "body-2";
        await simpleMessage(
          phoneNumber,
          "Enter your first paragraph (max. 100 words)"
        );
        break;
      case "body-2":
        essay.state.data.bodyTwo = userMsg;
        essay.state.step = "body-3";
        await simpleMessage(
          phoneNumber,
          "Enter your second paragraph (max. 100 words)"
        );
        break;
      case "body-3":
        essay.state.data.bodyThree = userMsg;
        await simpleMessage(
          phoneNumber,
          "Enter your third paragraph (max. 100 words)"
        );
        essay.state.step = "";

        let body =
          essay.state.data.bodyOne +
          "\n\n" +
          essay.state.data.bodyTwo +
          "\n\n" +
          essay.state.data.bodyThree;

        const saveEssay = await Essay.create({
          phoneNumber: phoneNumber,
          essayTitle: essay.state.data.prompt,
          essayBody: body,
        });

        await simpleMessage(phoneNumber, "Thank you for registering!");
        break;
    }

    // Save the updated user state to the database
    await essay.save();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createEssay,
};
