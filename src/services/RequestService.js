const { RequestModel } = require("../models");

class RequestService {
  saveRequest(newRequest) {
    return newRequest.save();
  }

  findRequestByUserId(user) {
    return RequestModel.find({ user }).exec();
  }
}

module.exports = RequestService;
