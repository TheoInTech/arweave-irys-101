import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import getIrys, { token } from "../utils/getIrys";
dotenv.config();

// npx ts-node 01-upload-file
// Image - https://gateway.irys.xyz/XEJQ3qIb0SB9Eb2M3QZn70YTfYUQU9uVwBD-e5PF6t4
// JSON - https://gateway.irys.xyz/YJ1937hTnw9tGP934LjUFGAMTVge-rAioi7qhu3IarA

const upload = async () => {
  const irys = await getIrys();
  const file = path.resolve(__dirname, "../images/dog.png");
  const tag = [
    { name: "Content-Type", value: "image/png" },
    {
      name: "app-id",
      value: "upd-irys-101",
    },
  ];

  // Get size of file
  const { size } = await fs.promises.stat(file);

  // Get cost to upload "size" bytes
  console.log("Calculating price...");
  const price = await irys.getPrice(size);

  // Fund the node
  console.log(
    `Funding node with ${size} bytes costs ${irys.utils.fromAtomic(
      price
    )} ${token}`
  );

  await irys.fund(price);

  // Upload metadata
  try {
    console.log(`Uploading file...`);
    const response = await irys.uploadFile(file, {
      tags: tag,
    });
    console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
  } catch (e) {
    console.log("Error uploading file ", e);
  }
};

upload();
