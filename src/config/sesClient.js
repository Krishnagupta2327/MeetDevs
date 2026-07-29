const {SESClient} = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
    region : process.env.SES_REGION,
    credentials:{
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }
});

module.exports = sesClient;