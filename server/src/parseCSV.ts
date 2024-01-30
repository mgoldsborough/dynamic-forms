import { promises as fs } from "fs";

/**
 * Parses a CSV and loads it into memory.
 * @param filePath the path of the input file
 * @returns The CSV as an array of objects.
 */
async function parseCSV(filePath: string): Promise<any[]> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const lines = data.split("\n");
    const headers = lines[0].split(",");

    const result = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        // @ts-ignore
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {});
    });

    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { parseCSV };
