const aws = require('aws-sdk');
const Resource = require("../models/resourceModel");
// const { fileURLGenerator } = require("../controllers/devController");
const { sendMediaMessage, sendMessage } = require("../controllers/openaiController");

const awsBoot = async () =>{
    let s3 = new aws.S3({
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRET  
    })
    
    s3.createBucket({
        Bucket: 'collegeresources'
    }, (error, success) => {
        if(error){
            console.log(error)
        }else(
            console.log(success)
        )
    })

    console.log(aws.config.region);
}

const fileURLGenerator = async (msgCode="brag sheet") => {
    return `https://github.com/makac1896/collegeresources/blob/main/${msgCode.replaceAll(" ", "%20")}.pdf?raw=true`;
}


const getResource = async (fileName="common app guide", phoneNumber="whatsapp:+12369939310")=>{

    let resource = await Resource.findOne({
        name: fileName
    });


    // resource.s3URI
    return {
        url: await fileURLGenerator(resource.fileName),
        description: resource.description
    };

    console.log(resource);

    //document not found
    if(Resource.exists({name: fileName})){
        return false;
    }else{
        console.log(resource);
        // await sendMediaMessage(phoneNumber, "Document Sent!", resource.s3URI);
        await sendMessage(phoneNumber, "Document Summary: Common Application Guidelines");
        return true;
    }

    return resource.s3URI;
 }



//  awsBoot();

module.exports = {
    awsBoot,
    getResource
}

