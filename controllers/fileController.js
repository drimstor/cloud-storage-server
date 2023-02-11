const { createDir, deleteFile } = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");
const config = require("config");
const fs = require("fs-extra");
const Uuid = require("uuid");
const {
  recourseDelete,
  changeFormatType,
  recourseRename,
} = require("../helpers/functions");

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const file = new File({
        name,
        type,
        parent,
        user: req.user.id,
        date: Date.now(),
      });
      const parentFile = await File.findOne({ _id: parent });

      if (parentFile) {
        file.path = `${parentFile.path}\\${file.name}`;
        parentFile.childs.push(file._id);
        await parentFile.save();
      } else {
        file.path = name;
      }

      await createDir(req, file);
      await file.save();
      return res.json(file);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  // -------------------------- //

  async getFiles(req, res) {
    try {
      const files = await File.find({
        user: req.user.id,
        parent: req.query.parent,
      });

      return res.json(files);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Can not get files" });
    }
  }

  // -------------------------- //

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      const user = await User.findOne({ _id: req.user.id });

      if (file.size >= 2147483647) {
        return res
          .status(400)
          .json({ message: "File size must not exceed 2GB" });
      }

      if (user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({ message: "There no space on the disk" });
      }

      user.usedSpace = user.usedSpace + file.size;

      const parentFile = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      });

      const path = `${req.filePath}\\${user._id}\\${
        parentFile ? parentFile.path : ""
      }\\${file.name}`;

      if (fs.existsSync(path)) {
        return res.status(400).json({ message: "File already exist" });
      }

      async function getDocumentTextContent(uri) {
        const response = await fetch(uri, { method: "GET" });
        if (!response.ok)
          throw new Error(
            `Problem retrieving the resource. Error message: ${response.statusText}`
          );
        const dec = new TextDecoder("windows-1252"); //Here I can inform the desired charset
        const arrBuffer = await response.arrayBuffer();
        const ui8array = new Uint8Array(arrBuffer);
        const text = dec.decode(ui8array);
        console.log(text);
        return text;
      }

      file.mv(path);

      const dbFile = new File({
        name: file.name,
        type: changeFormatType(file.name),
        size: file.size,
        path: parentFile ? `${parentFile.path}\\${file.name}` : file.name,
        parent: parentFile ? parentFile._id : null,
        user: user._id,
        date: Date.now(),
      });

      if (parentFile) {
        parentFile.childs.push(dbFile._id);
        await parentFile.save();
      }

      await dbFile.save();
      await user.save();

      res.json(dbFile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Upload error" });
    }
  }

  // -------------------------- //

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });

      const path =
        req.filePath + "\\" + req.user.id + "\\" + file.path;

      if (fs.existsSync(path)) {
        return res.download(path, file.name);
      }

      return res.status(400).json({ message: "Download error" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Downdload error" });
    }
  }

  // -------------------------- //

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });

      const parentFile = await File.findOne({
        _id: file.parent,
        user: req.user.id,
      });

      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }

      if (file.childs.length) {
        recourseDelete(file, req.user.id);
      }

      if (!!parentFile) {
        const newChilds = parentFile.childs.filter((child) => child != file.id);
        parentFile.childs = newChilds;
        await parentFile.save();
      }

      deleteFile(file);
      await file.remove();
      return res.json({ message: "The file has been deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Deletion error" });
    }
  }

  // -------------------------- //

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter((file) =>
        file.name.toLowerCase().includes(searchName)
      );
      return res.json(files);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Search error" });
    }
  }

  // -------------------------- //

  async uploadAvatar(req, res) {
    try {
      const file = req.files.file;
      const user = await User.findById(req.user.id);

      if (!!user.avatar) {
        fs.rmSync(config.get("staticPath") + "\\" + user.avatar, {
          recursive: true,
          force: true,
        });
      }

      const avatarName = Uuid.v4() + ".jpg";
      file.mv(config.get("staticPath") + "\\" + avatarName);
      user.avatar = avatarName;
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Avatar upload error" });
    }
  }

  // -------------------------- //

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id);
      fs.rmSync(config.get("staticPath") + "\\" + user.avatar, {
        recursive: true,
        force: true,
      });
      user.avatar = "";
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Avatar deletion error" });
    }
  }

  // -------------------------- //

  async renameFile(req, res) {
    try {
      const { id, newName } = req.body;
      const file = await File.findOne({ _id: id, user: req.user.id });
      file.name = newName;
      const oldPath =
        req.filePath + "\\" + req.user.id + "\\" + file.path;

      await recourseRename(file, req.user.id, newName, 1);

      const fullNewPath =
        req.filePath + "\\" + req.user.id + "\\" + file.path;

      if (fs.lstatSync(oldPath).isDirectory()) {
        fs.copySync(oldPath, fullNewPath);
        fs.rmSync(oldPath, { recursive: true });
      } else {
        fs.renameSync(oldPath, fullNewPath);
      }

      await file.save();
      return res.json(file);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Rename error" });
    }
  }
}

module.exports = new FileController();
