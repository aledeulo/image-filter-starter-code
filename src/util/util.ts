import fs from "fs";
import Jimp = require("jimp");


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string, storePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Received order to fetch image from: %s', inputURL);
      const photo = await Jimp.read(inputURL);
      const outpath = storePath + "/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      console.log('Received photo from Jimp');
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      console.log('Could not fetch the image from the URL: %s', inputURL);
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
