const fs = require("fs");

class FileUtils {

  static writeToFile(fileName, content) {
    fs.writeFile(fileName, content, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = FileUtils;
