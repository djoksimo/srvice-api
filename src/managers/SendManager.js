const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIAIE7SYRFTIRXOUW4A",
  secretAccessKey: "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",
  region: "us-east-1",
});

class SendManager {
  constructor(AuthenticationManager) {
    this._authenticationManager = AuthenticationManager;
  }

  async sendMail(data) {
    const { fromEmail, toEmail, name, message, email, token } = data;

    const verificationBody = await this._authenticationManager.verifyToken(token);
    if (verificationBody.status === 403) {
      return {
        status: 403,
        json: verificationBody,
      };
    }

    const ses = new AWS.SES({ apiVersion: "2012-10-17" });
    const params = {
      Destination: {
        ToAddresses: [toEmail],
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
          resolve(res);
        });
      });
      return {
        status: 201,
        json: {
          result,
        },
      };
    } catch (err) {
      return { status: 500, json: err };
    }
  }
}

module.exports = SendManager;
