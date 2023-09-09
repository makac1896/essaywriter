const { sendMessage, sendMediaMessage } = require("./openaiController");
const { generateResponse, generateImage, getRandomElementFromArray, checkArrayByField } = require("./openaiController");
const Ambassadors = require('../models/mentorSchema');

//for testing purposes only
const devAmbassadors = [
    {mentorID: '0001',PhoneNumber: '+12369939310', mentorName: 'John Doe',tags: ['tech', 'finance'], mentorEmail: 'abc@gmail.com',mentorDescription: 'My name is Tafara, I am currently a Second year student at UBC Vancouver. I am studying Mechanical Engineering and am willing to answer any questions related to studying here at UBC!', mentorPhoto: 'http://tinyurl.com/48s8uzf8'}
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

    var ambassadors = await Ambassadors.find({
        school
    })

    // var ambassadors = devAmbassadors;

    if(!ambassadors){
        //no ambassadors available for this school
        var msg =  `Unfortunately we do not yet have volunteers from this school. We have sent a request to our Recruitment team to resolve this!`;
    }else{
        // const templateMsg =  `*Important Guidelines*\n\n⭐_Our mentors are very busy, and responses can take *up to 72hrs.*_ \n\n ⭐In your first message, introduce yourself and clearly state you got the Mentor's contact via Dave.`;
        const templateMsg =  `*Important Communication Guidelines* 🌟\n\n
⭐ _*Respect Mentor's Time:*_\n Our mentors are very busy, and responses can take *up to 72 hours.* Please be patient and respectful of their time. \n\n
⭐ _*Introduction:*_\n In your first message, introduce yourself briefly. Mention your name, your current academic or career stage, and the specific reason you're reaching out for guidance. \n\n
⭐ _*Source of Contact:*_\n Clearly state that you got the mentor's contact via Dave, the HIS Alumni mentoring platform. This helps mentors understand the context of your message. \n\n
⭐ _*Professional Tone:*_\n Maintain a professional and courteous tone in all your messages. Address mentors with respect and gratitude for their assistance. \n\n
⭐ _*Concise Communication:*_\n Keep your messages clear and concise. State your questions or requests succinctly to make it easier for mentors to provide valuable guidance. \n\n
Remember that our mentors are here to help you succeed, and following these guidelines will ensure effective and respectful communication. Good luck with your mentoring journey! 🚀`

        
        //print out list of ambassadors for student
        ambassadors.forEach(async ambassador => {
           var msg = '';
           msg += `*${school.toUpperCase()} Ambassador Profile* \n\n*Name:* ${ambassador.mentorName}\n\n*Interests:* ${ambassador.tags.toString()}\n\n*Email:* ${ambassador.mentorEmail}\n\n
*Bio:*\n_${ambassador.mentorDescription}_\n\n--------\n
_*Click the link to submit a question to this Ambassador.*_\n\n🔗: https://wa.me/${ambassador.mentorPhoneNumber}?text=Hi%20${ambassador.mentorName.replaceAll(" ", "%20")}`

        await sendMediaMessage(phoneNumber, await msg, ambassador.mentorPhoto);
        // await sendMessage(phoneNumber, msg);
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

    msg += `\n\n To view ambassador profiles use the following command: _connect student school_ \n\n e.g *_connect student harvard_*`;

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
