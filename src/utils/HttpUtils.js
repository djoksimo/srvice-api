class HttpUtils {
  static sendResponse(response, result) {
    const { status, json } = result;
    response.status(status).json(json);
  }
}

module.exports = HttpUtils;
