const {createDoc, authorize, convertGoogleDocURL} = require("../config/google");
const {sendEmail} = require("../config/nodemailer");
const Mentor = require("../models/mentorSchema");
const User = require("../models/userSchema");
const Essay = require("../models/essayModel");
const { simpleMessage } = require("./openaiController");

const devMentors = [
    {mentorPhoneNumber: "+12369939310", mentorName: "Makatendeka Chikumbu", tags: ["tech", "scholarships"], mentorEmail: "makac1896@gmail.com"}
]

const devStudents = [
    {studentPhoneNumber: "+263779896225", tags: ["tech", "scholarships"]}
]

//function to match a student with a mentor
const matchMentor = async (phoneNumber)=>{

//get all mentors from database
var mentors = devMentors // await Mentor.find({})

//get student from database
var student = devStudents /*await User.findOne({
    studentPhoneNumber: phoneNumber
})*/

//if student does not exist in database
if(!student){
//create a new student with this number before proceeding
const newUser = await User({
    studentPhoneNumber: phoneNumber,
    tags: ["scholarships", "financial aid", "high school"]
});
//save to database
newUser.save();
}

//
var matches = [];

//check for common tags between student and existing mentors
 matches = mentors.filter(mentor => {
    let tags = mentor.tags;
    var commonTag = true /*tags.some(tag =>{
        return student.tags.includes(tag)
    })*/

    //if match was found
    if(commonTag){
        return mentor;
    }
});

//if no mentors were found match at random
if(matches.length===0){
    //match 3 random mentors to a student
    for (let index = 0; index < 2; index++) {
    var randomNumber = Math.random(mentors.length-1);
    matches.push(mentors[randomNumber]);  
    }
}

return matches;
}

const requestEssayFeedback = async (phoneNumber, essayBody, prompt)=>{
    //match student to some mentors
    console.log(mentors);
    var mentors = await matchMentor(phoneNumber);

    //create google doc to share essay easily
    let documentID;
    let documentURL;

    // Call the authorize function first to get the authentication value
    authorize()
    .then(authValue => {
        // Once authorized, use the authValue to call the createDoc function
        return createDoc(authValue);
    })
    .then(async docID => {
        // Store the returned URL in the variable
        documentID = docID;
        console.log(`DOCUMENT ID IS: ${docID}`);
        documentURL = await convertGoogleDocURL(documentID);

        //save essay to database
        const saveEssay = Essay.create({
            studentPhoneNumber: phoneNumber,
            essayTitle: prompt,
            essayBody,
            mentors
        });

        console.log(await saveEssay);

        //send emails out to mentors 
    mentors.forEach(async (match) => {
        //template email
        var msg = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
        
                .header {
                    text-align: center;
                    background-color: green;
                    color: white;
                    padding: 10px;
                }
        
                .content {
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
        
                .signature {
                    text-align: center;
                    padding: 20px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>A message from Dave:</h2>
                    <i>"Built with passion, fueled by ambition"</i>
                </div>
                <div class="content">
                    <p>Hey <b>${match.mentorName}</b>,</p>
        
                    <p> Iris, Dave's dedicated matching algorithm, has assigned you to review an essay from one of our talented students.</p>     

                    <p>Attached to this email is the essay in question alongside a custom <a href="#">Iris Report</a>.</p> <p> An Iris Report is a comprehensive and personalized assessment tool used by our mentoring system. It is created by analyzing the student's interactions and engagements with Dave. This report provides depth insights into the student's writing level, strengths, and areas that need improvement.</p>
        
                    <p>Please feel free to provide your feedback directly on this <a href="${documentURL}">document</a> or, if you prefer, you can share your thoughts directly with the student at <b>${phoneNumber}</b>.</p>
        
                    <p>As you prepare to provide feedback, I'd like to share a few general practices that can help ensure you offer the best guidance to our students:</p>
        
                    <ul>
                        <li><b>Personal Narrative:</b> Encourage students to share a personal story or experience that showcases their unique qualities and character. Suggest ways they can infuse their personality into the essay to make it memorable.</li>
        
                        <li><b>Clarity and Conciseness:</b> Review the essay for clarity and conciseness. Help students refine their ideas to ensure that their message is clear and easy to understand.</li>
        
                        <li><b>Engaging Introduction:</b> Discuss the importance of a captivating introduction that draws the reader in. Suggest strategies for starting the essay with an engaging hook.</li>
        
                        <li><b>Show, Don't Tell:</b> Advise students to use vivid and descriptive language to illustrate their experiences and qualities. Encourage them to provide specific examples that showcase their attributes.</li>
        
                        <li><b>Reflect on Growth:</b> Help students reflect on personal growth or lessons learned from their experiences. Emphasize the importance of self-reflection in making the essay meaningful.</li>
                    </ul>
        
                    <p>Thank you so much for your ongoing support and dedication to our students' success. Your mentorship continues to make a positive impact, and we are truly grateful to have you as a part of our team.</p>
        
                    <div class="signature">
                        This message was sent by,<br>
                        Dave Essay Review System
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;        

    console.log(`URL AFTER PROCESSING: `+ await documentURL);

    //send actual email to mentor
    await sendEmail("New Essay Review Request Received | HIS Alumni", msg, match.mentorEmail);
    await simpleMessage(phoneNumber, `A new essay review request has been received. Kindly track feedback here: \n\n 🔗: ${documentURL}`)
    });  

    // Now you can use the documentUrl variable as needed
        console.log('Document ID:', docID);
    })
    .catch(error => {
        console.error('Error:', error);
    });


    //generate a shareable document url
    // let documentURL = await convertGoogleDocURL(documentID) || "https://docs.google.com/document/d/1eMikItAhc-vULfLrQIEkvXcm42beKLRhk6xt4EUuoFw/edit";
};

module.exports = {
    matchMentor,
    requestEssayFeedback
}