import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // const eventsListData = await client.queries.eventConnection({ last: -1 });
    // const events = eventsListData?.data?.eventConnection?.edges ?? [];
    // return Response.json({ data: events }, { status: 200 });
    const jsonData = readJsonFiles(); // Call the utility function with your folder path
    return Response.json({ data: jsonData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export function readJsonFiles() {
  const folderPath = path.join(process.cwd(), "events"); // Get the absolute path to the folder
  const fileNames = fs.readdirSync(folderPath); // Read all file names in the folder

  // Filter JSON files and read their contents
  const jsonData = fileNames
    .filter((file) => file.endsWith(".json")) // Filter only JSON files
    .map((file) => {
      const filePath = path.join(folderPath, file); // Get the absolute path to the file
      const fileContent = fs.readFileSync(filePath, "utf8"); // Read the file contents
      return JSON.parse(fileContent); // Parse JSON and return the data
    });

  return jsonData;
}
