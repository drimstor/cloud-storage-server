const File = require("../models/File");
const fs = require("fs-extra");
const { pictureFormats, mediaFormats } = require("./constants");

function recourseDelete(currentFile, userId) {
  currentFile.childs.forEach(async (child) => {
    const childFile = await File.findOne({
      _id: child,
      user: userId,
    });
    if (childFile) {
      childFile.childs.length && recourseDelete(childFile, userId);
      await childFile.remove();
    }
  });
}

async function recourseRename(currentFile, userId, newName, index) {
  const pathArray = currentFile.path.split("/");
  pathArray.splice(pathArray.length - index, 1, newName);
  const newPath = pathArray.join("/");
  currentFile.path = newPath;
  await currentFile.save();

  if (!!currentFile.childs.length) {
    currentFile.childs.forEach(async (child) => {
      const childFile = await File.findOne({ _id: child, user: userId });
      await recourseRename(childFile, userId, newName, index + 1);
    });
  }
}

function changeFormatType(fileName) {
  let type = fileName.split(".").pop().toLowerCase();
  pictureFormats.forEach((format) => type === format && (type = "picture"));
  mediaFormats.forEach((format) => type === format && (type = "media"));
  type !== "picture" && type !== "media" && (type = "file");
  return type;
}

async function deleteUserContent(element, id) {
  const content = await element.findOne({ _id: id });

  if (content?.image) {
    const path = req.filePath + "/" + content?.image;
    await fs.unlink(path);
  }
}

module.exports = {
  recourseDelete,
  recourseRename,
  changeFormatType,
  deleteUserContent,
};
