class RequestManager {

  constructor(RequestService) {
    this.requestService = RequestService;
  }

  async createRequest({ email, token, user }) {
    return { status: 200, json: {}}
  }
}

module.exports = RequestManager;
