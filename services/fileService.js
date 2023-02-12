const fs = require("fs-extra");

class FileService {
  createDir(req, file) {
    const filePath = `${req.filePath}/${file.user}/${file.path}`;
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
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
    const path = `${req.filePath}/${file.user}/${file.path}`;
    fs.rmSync(path, { recursive: true });
    // fs.remove(path, { recursive: true });
  }
}

module.exports = new FileService();
