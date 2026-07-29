const {SendEmailCommand} = require('@aws-sdk/client-ses');
const sesClient = require('../config/sesClient.js');
require('dotenv').config();
async function sendEmail( {to, sub, body}){
    const command = new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL,
        Destination : {
            ToAddresses: [to],
        },
        Message:{
            Subject: {
                Data: sub
             },
            Body:{
                Text:{
                    Data: body
                }
            }
        }
    });
    await sesClient.send(command);
}

module.exports = sendEmail;