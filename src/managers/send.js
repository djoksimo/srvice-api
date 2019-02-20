const AWS = require("aws-sdk");

const route = "/send/";

AWS.config.update({
  accessKeyId: 'AKIAIE7SYRFTIRXOUW4A',
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
