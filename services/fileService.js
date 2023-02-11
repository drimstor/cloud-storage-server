const fs = require("fs");
const File = require("../models/File");
// const config = require("config");

class FileService {
  createDir(req, file) {
    const filePath = `${req.filePath}\\${file.user}\\${file.path}`;
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: "File was created" });
        } else {
          return reject({ message: "File already exist" });
        }
      } catch (error) {
        return reject({ message: error });
      }
    });
  }

  // -------------------------- //

  deleteFile(req, file) {
    const path = `${req.filePath}\\${file.user}\\${file.path}`;
    fs.rmSync(path, { recursive: true, force: true });
  }
}

module.exports = new FileService();
