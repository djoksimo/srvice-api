const AWS = require("aws-sdk");

const route = "/send/";

AWS.config.update({
  accessKeyId: 'AKIAJ4KBAENBAOD2WFLQ',
  secretAccessKey: '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',
  region: 'us-east-1',
});

class SendManager {

  constructor(AuthManager) {
    this._authManager = AuthManager;
  }

  async sendMail(data) {

    const { // email variable is replyTo address
      fromEmail,
      toEmail,
      name,
      message,
      email,
      token
    } = data;


    const verificationBody = await this._authManager.verifyToken(token);
    if (verificationBody.status === 403) {
      return {
        status: 403,
        json: verificationBody
      }
    }

    const ses = new AWS.SES({ apiVersion: "2012-10-17" });
    const params = {
      Destination: { /* required */
        ToAddresses: [
          toEmail,
        ],
      },
      Message: {
        Body: {
          Html: {
            // HTML Format of the email
            Charset: "UTF-8",
            Data: `<div>${message}</div>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: message,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: name,
        },
      },
      ReplyToAddresses: [email],
      Source: fromEmail,
    };

    try {
      const result = await new Promise((resolve, reject) => {
        ses.sendEmail(params, (err, res) => {
          if (err) {
            reject(err);
          }
          console.log('Here is the mail response: ', res);
          resolve(res);
        });
      });
      return {
        status: 201,
        json: {
          message: "Mail sent successfully",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (err) {
      console.error("Error sending mail: ", err);
      return { status: 500, json: err };
    }
  }
}

module.exports = SendManager;


// const nodemailer = require('nodemailer');
// const aws = require('aws-sdk');
//
// aws.config.update({ region: 'us-east-1' });
//
//
// const route = "/send/";
//
// class SendManager {
//   async sendMail(data) {
//     const {
//       fromEmail, toEmail, name, message, email,
//     } = data;
//
//     const transporter = nodemailer.createTransport({
//       SES: new aws.SES({
//         apiVersion: '2010-12-01',
//         accessKeyId: 'AKIAISNCEXVWN2ZKNR4Q',
//         secretAccessKey: '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',
//         region: 'us-east-1',
//         rateLimit: 1,
//       }),
//     });
//
//     // const transporter = nodemailer.createTransport({
//     //   host: 'mail.srvice.ca',
//     //   port: 465,
//     //   secure: true,
//     //   auth: {
//     //     user: 'contact@srvice.ca',
//     //     pass: 'MadeMeThinkOfKik123!',
//     //   },
//     // });
//
//     const mailOptions = {
//       from: fromEmail,
//       to: toEmail,
//       subject: name,
//       text: message,
//       replyTo: email,
//     };
//
//     try {
//       const result = await new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptions, (err, res) => {
//           if (err) {
//             reject(err);
//           }
//           console.log('Here is the mail response: ', res);
//           resolve(res);
//         });
//       });
//       return {
//         status: 201,
//         json: {
//           message: "Mail sent successfully",
//           request: {
//             type: "POST",
//             url: "http://" + "165.227.42.141:5000" + route,
//           },
//           result,
//         },
//       };
//     } catch (err) {
//       console.error("Error sending mail: ", err);
//       return { status: 500, json: err };
//     }
// }
// }
//
// module.exports = SendManager;
