import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import getIrys, { token } from "../utils/getIrys";
dotenv.config();

// npx ts-node 02-upload-folder
// https://gateway.irys.xyz/5VXi9CMeHNCQCPcCypCj822xX7BRrpBoyWqOlMA_ICA

const getAllFiles = (dirPath: string, arrOfFiles?: Array<string>) => {
  const files = fs.readdirSync(dirPath);
  let arrayOfFiles = arrOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  console.log("arrayOfFiles", arrayOfFiles);

  return arrayOfFiles;
};

const getTotalSize = (dirPath: string) => {
  const arrayOfFiles = getAllFiles(dirPath);

  let totalSize = 0;

  arrayOfFiles.forEach((filePath) => {
    totalSize += fs.statSync(filePath).size;
  });

  return totalSize;
};

const upload = async () => {
  const irys = await getIrys();
  const folder = path.resolve(__dirname, "../images");
  const tags = [
    { name: "Content-Type", value: "image/png" },
    {
      name: "app-id",
      value: "upd-irys-101",
    },
  ];

  // Get size of folder
  console.log(`Calculating size of folder...`);
  const size = await getTotalSize(folder);

  // Get cost to upload "size" bytes
  console.log(`Calculating price of ${size} bytes...`);
  const price = await irys.getPrice(size);

  // Fund the node
  console.log(
    `Funding node with ${size} bytes costs ${irys.utils.fromAtomic(
      price
    )} ${token}`
  );
  await irys.fund(price);

  // Upload an entire folder
  try {
    const response = await irys.uploadFolder(folder, {
      indexFile: "", // Optional index file (file the user will load when accessing the manifest)
      batchSize: 50, // Number of items to upload at once
      keepDeleted: false, // Whether to keep now deleted items from previous uploads
      manifestTags: tags,
    });

    console.log(`Files uploaded. Manifest ID ${response?.id}`);
    console.log(`File uploaded ==> https://gateway.irys.xyz/${response?.id}`);
  } catch (e) {
    console.log("Error uploading file ", e);
  }
};

upload();
