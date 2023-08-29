const { sendMessage, sendMediaMessage } = require("./openaiController");
const { generateResponse, generateImage, getRandomElementFromArray, checkArrayByField } = require("./openaiController");
const Ambassadors = require('../models/mentorSchema');

//for testing purposes only
const devAmbassadors = [
    {mentorID: '0001', mentorName: 'John Doe',tags: ['tech', 'finance'], mentorEmail: 'abc@gmail.com',mentorDescription: 'My name is John, a second year university at Cornell.', mentorPhoto: 'https://imgur.com/a/BVhGXZa'}
]

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

//function to get list of ambassodors 
const getAmbassadors = async (phoneNumber, school='ubc')=>{
    //get list of all ambassadors   

    // var ambassadors = await Ambassadors.find({
    //     school
    // })

    var ambassadors = devAmbassadors;

    if(!ambassadors){
        //no ambassadors available for this school
        var msg =  `Unfortunately we do not yet have volunteers from this school. We have sent a request to our Recruitment team to resolve this!`;
    }else{
        var msg = '';
        //print out list of ambassadors for student
        ambassadors.forEach(async ambassador => {
           msg += `*${school.toUpperCase} Ambassador Profile* \n\n
           *MentorID:* ${ambassador.mentorID}\n\n
           *Name:* ${ambassador.mentorName}\n\n
           *Interests:* ${ambassador.tags.toString()}\n\n
           *Email:* ${ambassador.mentorEmail}\n\n

            ${ambassador.mentorDescription} \n\n
           
           Click the link to submit a question to this Ambassador.\n\n
           🔗: https://wa.me/+14155238886?text=FAQ%20submit%20${ambassador.mentorID}`

        await sendMediaMessage(phoneNumber, msg, ambassador.mentorPhoto);
        });
    }
}

//list schools
const listSchools = async (phoneNumber)=>{
    var msg = `*List of Supported Schools 🌍*\n\n
        
    _Please note we do not have ambassadors for all our partner schools yet._\n\n`;
    
    //send user list of all supported schools
    schools.forEach(async (school, index) =>{
        msg += `${index + 1}. *${school.toUpperCase()}*\n`
    })

    msg += `\n\n To view ambassador profiles use the following command: _view ambassadors school_ \n\n e.g *_view ambassadors harvard_*`;

    await sendMessage(phoneNumber, msg);
}

const hasMultipleCommonElements = (array1, array2) => {
    // Convert both arrays to Sets with lowercase strings for case-insensitive comparison
    const set1 = new Set(array1.map(str => str.toLowerCase()));
    const set2 = new Set(array2.map(str => str.toLowerCase()));
  
    // Initialize a counter for common elements
    let commonCount = 0;
  
    // Iterate through set1 and check for common elements in set2
    for (const str of set1) {
      if (set2.has(str)) {
        commonCount++;
        // If there are more than one common elements, return true
        if (commonCount > 1) {
          return true;
        }
      }
    }
  
    // If we reach this point, there's either zero or only one common element
    return false;
  };
  

module.exports = {
    listSchools,
    getAmbassadors,
    hasMultipleCommonElements
}
