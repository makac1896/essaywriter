const {createDoc, authorize, convertGoogleDocURL} = require("../config/google");
const {sendEmail} = require("../config/nodemailer");
const CareerMentor = require("../models/careerMentorModel");
const { simpleMessage, sendMediaMessage } = require("./openaiController");

// development only
// const careerMentors = [
//     {
//       "mentorPhoneNumber": "+12369939310",
//       "mentorName": "Douglas Important",
//       "tags": [
//         "Finance",
//         "Developmental Economics",
//         "Software Development",
//       ],
//       "mentorDescription": `I am a recent graduate of Harvard University where I obtained a bachelor's degree with High Honours in Chemistry with a sustained interest in both chemical theory and research. I also have a minor in Economics. I was born in Harare, Zimbabwe. My life's goal is to revolutionise healthcare and development in my home country Zimbabwe. I am pursuing a Master's Degree in Chemical Engineering from The University of Cambridge. I am passionate about Healthcare and Energy and I want to dedicate my life to building sustainable systems in both fields.
  
//       I believe the future of healthcare in Africa is low-cost diagnostics! Every year millions of Africans go untreated because of severe under-diagnosis due to either cost or availability constraints of diagnostic tools. I want to change that. I want to acquire all the tools needed to start my own low-cost diagnostics company to span across the continent.`,
//       "mentorEmail": "douglas.important@gmail.com",
//       "employmentStatus": "Product Manager at Google",
//     },
//     {
//       "mentorPhoneNumber": "+12345678901",
//       "mentorName": "Emily Johnson",
//       "tags": ["Medicine", "Public Health", "Medical Research"],
//       "mentorDescription": `I am a medical doctor with over 10 years of experience in the field of medicine and public health. I have worked on various projects related to infectious diseases and vaccine development. I am passionate about mentoring young minds and guiding them in their journey towards a career in medicine or public health. Feel free to reach out to me for advice and guidance.`,
//       "mentorEmail": "emily.johnson@example.com",
//       "employmentStatus": "Chief Medical Officer at a Public Health Organization",
//     },
//     {
//       "mentorPhoneNumber": "+9876543210",
//       "mentorName": "David Smith",
//       "tags": ["Engineering", "Aerospace", "Robotics"],
//       "mentorDescription": `I am an aerospace engineer with a strong background in robotics and automation. I have worked on projects ranging from designing drones for agricultural use to developing autonomous systems for space exploration. I am enthusiastic about inspiring young minds to pursue a career in engineering and robotics. Let's explore the fascinating world of engineering together!`,
//       "mentorEmail": "david.smith@example.com",
//       "employmentStatus": "Lead Engineer at SpaceX",
//     },
//     {
//       "mentorPhoneNumber": "+1122334455",
//       "mentorName": "Sarah Miller",
//       "tags": ["Environmental Science", "Sustainability", "Conservation"],
//       "mentorDescription": `I am an environmental scientist dedicated to preserving our planet's natural resources. I have conducted research on sustainable agriculture practices and conservation efforts. I am eager to mentor high school students interested in environmental science and sustainability. Together, we can make a positive impact on the environment.`,
//       "mentorEmail": "sarah.miller@example.com",
//       "employmentStatus": "Environmental Scientist at a Conservation Organization",
//     },
//     {
//       "mentorPhoneNumber": "+9876543210",
//       "mentorName": "Michael Brown",
//       "tags": ["Computer Science", "Artificial Intelligence", "Machine Learning"],
//       "mentorDescription": `I am a computer scientist specializing in artificial intelligence and machine learning. I have worked on cutting-edge projects in AI and am excited to mentor students interested in this field. Let's explore the world of algorithms and data together!`,
//       "mentorEmail": "michael.brown@example.com",
//       "employmentStatus": "AI Researcher at a Tech Company",
//     },
//     {
//       "mentorPhoneNumber": "+1122334455",
//       "mentorName": "Laura Davis",
//       "tags": ["Architecture", "Urban Planning", "Design"],
//       "mentorDescription": `I am an architect and urban planner with a passion for creating sustainable and innovative designs. I have worked on urban revitalization projects and sustainable architecture. If you're interested in the world of architecture and design, I'm here to guide you on your journey.`,
//       "mentorEmail": "laura.davis@example.com",
//       "employmentStatus": "Principal Architect at an Architecture Firm",
//     },
//     {
//       "mentorPhoneNumber": "+9876543210",
//       "mentorName": "James Wilson",
//       "tags": ["Finance", "Investment Banking", "Economics"],
//       "mentorDescription": `I have over 15 years of experience in the world of finance and investment banking. I have worked on mergers and acquisitions, investment strategies, and financial analysis. If you're interested in finance and economics, I can provide valuable insights and guidance.`,
//       "mentorEmail": "james.wilson@example.com",
//       "employmentStatus": "Vice President of Investment Banking at a Financial Institution",
//     },
//     {
//       "mentorPhoneNumber": "+1122334455",
//       "mentorName": "Maria Rodriguez",
//       "tags": ["Marketing", "Digital Marketing", "Brand Strategy"],
//       "mentorDescription": `I am a marketing professional with a background in digital marketing and brand strategy. I have worked with both startups and established companies to develop effective marketing campaigns. If you're interested in the world of marketing, I'm here to help you navigate it.`,
//       "mentorEmail": "maria.rodriguez@example.com",
//       "employmentStatus": "Marketing Manager at a Tech Startup",
//     },
//     {
//       "mentorPhoneNumber": "+9876543210",
//       "mentorName": "John Smith",
//       "tags": ["Psychology", "Mental Health Counseling", "Therapy"],
//       "mentorDescription": `I am a licensed psychologist with expertise in mental health counseling and therapy. I have helped individuals overcome various mental health challenges and improve their well-being. If you're interested in psychology and counseling, I'm here to provide guidance and support.`,
//       "mentorEmail": "john.smith@example.com",
//       "employmentStatus": "Clinical Psychologist in Private Practice",
//     },
//     {
//       "mentorPhoneNumber": "+1122334455",
//       "mentorName": "Nancy Lee",
//       "tags": ["Education", "Teaching", "Curriculum Development"],
//       "mentorDescription": `I am an educator with a passion for teaching and curriculum development. I have experience working in both traditional and online education settings. If you're interested in pursuing a career in education, I can offer valuable insights and advice.`,
//       "mentorEmail": "nancy.lee@example.com",
//       "employmentStatus": "Director of Curriculum Development at an Education Institution",
//     },
//   ];
  

//generate list of all career mentor profiles
const getCareerMentors = async (phoneNumber)=>{
    //get list of all ambassadors   

    var careerMentors = await CareerMentor.find({});

    console.log(careerMentors)

    // var ambassadors = devAmbassadors;

    if(!careerMentors){
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

        
        var msg = '*Career Mentor Profiles*\n\nℹ️ _To view a mentor profile, type their access code_ \n\n';
        //print out list of mentors for student
        await careerMentors.forEach(async careerMentor => {        
        msg +=  `*👤 Name:* ${careerMentor.mentorName}\n*🌍 Interests:* ${careerMentor.tags.toString()}\n*🔐 Access Code:* _${careerMentor.accessCode}_\n ------\n\n`
        // await sendMessage(phoneNumber, msg);
        });

        await simpleMessage(phoneNumber, await msg);


    }
}


//summary of all career mentor profiles


//generate/search career mentor profile
const searchCareerMentor = async (phoneNumber, msgcode)=>{
    const careerMentor = await CareerMentor.findOne({"accessCode": msgcode});
    msg =  `*🌟 Professional Development Mentor Profile 🌟*\n\n
    *👤 Name:* ${careerMentor.mentorName}\n\n
    *🌍 Interests:* ${careerMentor.tags.toString()}\n\n
    *🔐 Access Code:* ${careerMentor.accessCode}\n\n
    
    _*Click the link to connect with ${careerMentor.mentorName}:*_\n
    🔗: Connect with ${careerMentor.mentorName}: https://wa.me/${careerMentor.mentorPhoneNumber}?text=Hi%20${careerMentor.mentorName.replaceAll(" ", "%20")}
    `
    // msg += `*🌟 Professional Development Mentor Profile 🌟* \n\n*👤 Name:* ${careerMentor.mentorName}\n\n*🚀 Current Role(s):* ${careerMentor.employmentStatus} \n\n*🌍 Interests:* ${careerMentor.tags.toString()}\n\n*📧 Email:* ${careerMentor.mentorEmail}\n\n*📝 Bio:*\n_${careerMentor.mentorDescription}_\n\n--------\n\n_*Click the link to submit a question to this Careers Mentor.*_\n\n🔗: Connect with ${careerMentor.mentorName}: https://wa.me/${careerMentor.mentorPhoneNumber}?text=Hi%20${careerMentor.mentorName.replaceAll(" ", "%20")}`;
}


//submit a question to a career mentor



module.exports={
    getCareerMentors
}