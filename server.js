const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const process = require('process');
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const { createEssay, serverDelay, logicHandler, fileURLGenerator } = require("./controllers/devController");
const { sendMessage, simpleMessage, sendMediaMessage, generateResponse } = require("./controllers/openaiController");
const {sendEmail }=require("./config/nodemailer");

//google docs config
const {authorize} = require("./config/google");

//authorize and initialize API
authorize()

//aws
const { awsBoot, getResource } = require('./config/aws');
const { get } = require('mongoose');

//setup express app
const app = express()

//send a test email
// sendEmail();

//connect to database
connectDB();

//Setup JSON Parsing
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(bodyParser.urlencoded({ extended: false }));


//api requests
app.post('/sms', async (req, res)=>{
    const userMessage = req.body.Body;
    const phoneNumber = req.body.From;

    console.log(typeof(phoneNumber)
    );

    await logicHandler(userMessage, phoneNumber);

    // if(logicHandler(userMessage, phoneNumber)===false){
    //     await createEssay(userMessage, phoneNumber);
    //     console.log("Case 2")
    // }else{
    //     sendMessage(phoneNumber, "File in progress...");
    // }
    
    console.log(userMessage + "\n\n--------------\n\n-------------");
    
    // let openaiMessage = await generateResponse(userMessage);

    // await sendMessage(phoneNumber, openaiMessage);

    // res.status(200).json({message: "Hello"});
})

app.listen(port, async ()=> {
    console.log(`Server started on port ${port}`);
    // await createGoogleDoc("test document").catch((err)=>{
    //     console.error('Error:', err.message)
    // });

    // sendMessage("whatsapp:+12369939310", "Before you start, check this out! \n\n ⬇️⬇️⬇️⬇️⬇️⬇️")
    // sendMediaMessage("whatsapp:+12369939310", "Welcome, please review this document first!", "https://jmc.msu.edu/_assets/pdfs/academics/writing%20consultancy/write-personal-statement.pdf")
    //1000ms delay to send messages in correct order
    // serverDelay();
    // const url = "https://github.com/makac1896/collegeresources/blob/main/his%20logo.png?raw=true";
    // sendMediaMessage(null, `Welcome to HIS Alumni! We strive to make your College process smoother, meet *dAVE*\n\n Our newest digital assistant to help you at every stage of the College process! \n\n _Built with passion, fueled by ambition!_ \n\n *Type "list schools" to see available resources*`, url);
    // sendMessage("whatsapp:+12369939310", "Welcome to HIS Alumni")
    // sendMediaMessage("whatsapp:+12369939310", "_HIS Merit Scholarship Alumni_ \n📜~Fast, Accurate, Free! \n\n Please enter your essay title:", await getResource("harvard ps"));
    // sendMediaMessage("whatsapp:+12369939310", "_HIS Merit Scholarship Alumni_ \n📜~Fast, Accurate, Free! \n\n Please enter your essay prompt!", "https://i.ibb.co/G9Xx97V/przemyslaw-marczynski-T-tg8-Vc-DLJ8-unsplash.jpg");
});