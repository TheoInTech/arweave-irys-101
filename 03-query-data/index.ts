import Query from "@irys/query";

// npx ts-node 03-query-data

const devnetUri = { url: "https://devnet.irys.xyz/graphql" };

const queryData = async () => {
  const query = new Query(devnetUri);

  const results = await query
    .search("irys:transactions")
    .from(["AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN"])
    .tags([
      {
        name: "app-id",
        values: ["upd-irys-101"],
      },
      { name: "Content-Type", values: ["image/png"] },
    ]);

  console.log("Results: ", results);

  /**
   * Next steps:
   * Use the URL with the receipt ID to fetch the data
   * 1. For JSON, you can parse the data and use the JSON as is
   * 2. For media (image, video, music), you can use the data to display the image
   * 3. For text data, you can display the text
   *  */
};

queryData();
