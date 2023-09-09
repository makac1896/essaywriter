const { sendMessage, sendMediaMessage } = require("./openaiController");
const { generateResponse, generateImage, getRandomElementFromArray, checkArrayByField } = require("./openaiController");
const Ambassadors = require('../models/mentorSchema');

/*
This function(s) are there to handle any questions 
sent by mentees to mentors and then redirects them to 
mentors whilst also adding them to a database for review 
before making a new FAQ instance.
*/

const sendQuestionToMentor = async (mentorID, question)=>{  
    //get mentor from database
    const Mentor = await Ambassadors.findOne({ mentorID })

}