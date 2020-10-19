const AWS = require('aws-sdk');
const fs = require('fs');

const privateKey = fs.readFileSync('./pk.pem', {encoding: 'utf8'});

const Signer = new AWS.CloudFront.Signer(process.env.PUBLIC_KEY, privateKey) ;
const getSignedUrl = async (event) => {
  console.log(event);
    const filepath = event.body.key;
    if(!filepath){
      return "key is missing in header";
    }
    const cloudUrl = process.env.CLOUD_URL;
    const signingParams = {
        url: `https://${cloudUrl}.cloudfront.net/${filepath}`, 
        expires: Math.round(new Date().getTime()/1000) + 1200
      }
      
      
      return new Promise((resolve, reject) => {
            Signer.getSignedUrl(signingParams, (err, signedUrl) => {
                  console.log(err, signedUrl)
                  if(signedUrl){
                    return resolve({signedUrl})
                  }
                  return reject(err)
                })
          })
}
exports.handler = getSignedUrl;



