class GoogleUtils {
  static getPublicUrl(fileName) {
    return `https://storage.googleapis.com/${fileName}`;
  }
}

module.exports = GoogleUtils;
