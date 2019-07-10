class HttpUtils {
  static sendResponse(response, result) {
    const { status, json } = result;
    response.status(status).json(json);
  }

  static parseAuthHeaders(request) {
    const headers = {};
    headers.token = request.header("token");
    headers.email = request.header("email");
    if (request.header("userId")) {
      headers.userId = request.header("userId");
    } else if (request.header("agentId")) {
      headers.agentId = request.header("agentId");
    }
    return headers;
  }
}

module.exports = HttpUtils;
