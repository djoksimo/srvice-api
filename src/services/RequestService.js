class RequestService {
  createRequest(newRequest) {
    return newRequest.save();
  }
}

module.exports = RequestService;
