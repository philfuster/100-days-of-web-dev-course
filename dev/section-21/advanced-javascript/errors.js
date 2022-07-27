const fs = require("fs");

function readFile() {
  try {
    const fileData = fs.readFileSync('data.json');
  } catch {
    console.log('Error reading data.json file');
  }
  console.log('Hi there!');
}

readFile();

module.exports = {
  readFile: readFile
}