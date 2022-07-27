const fs = require("fs/promises");

// async makes the method return a promise
async function readFile() {
  let fileData;

  // fs.readFile("data.txt", function(error, fileData) {
  // if (error) {
  // ...
  // }
  //   console.log('file parsing done!');
  //   console.log(fileData.toString());
  //   // start another async task that sends the data to a database.

  // });
  try {
    fileData = await fs.readFile("data.txt");
  } catch (error) {
    console.log(error);
  }
  console.log("file parsing done!");
  console.log(fileData.toString());

  // return anotherAsyncOperation;
  // .then(function (fileData) {
  //   console.log("file parsing done!");
  //   console.log(fileData.toString());
  //   // return anotherAsyncOperation;
  // })
  // .then(function () {})
  // .catch(function (error) {
  //   console.log(error);
  // });

  console.log("Hi there!");
}

readFile();
