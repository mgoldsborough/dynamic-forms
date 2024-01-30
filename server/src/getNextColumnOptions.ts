/**
 * Gets the next options
 * @param data The CSV data.
 * @param currentSelections The current headers and selected values as key/value pairs.
 * @returns The next collumn name and options, if there is a valid set of selections. Null otherwise.
 */
async function getNextColumnOptions(
  data: any[],
  currentSelections: FormSelection
): Promise<ColumnOptions | null> {
  let filteredData = data;

  console.log("Looking for selections");
  console.log(JSON.stringify(currentSelections, null, 2));

  for (const column in currentSelections) {
    filteredData = filteredData.filter(
      (row) => row[column] === currentSelections[column]
    );
  }

  if (filteredData.length === 0) {
    console.log("ERROR: No data matching selections found.");
    return null;
  }

  for (const column of Object.keys(filteredData[0])) {
    if (!(column in currentSelections)) {
      // filter out null and empty string values
      const uniqueValues = Array.from(
        new Set(
          filteredData
            .map((row) => row[column])
            .filter((value) => value != null && value !== "")
        )
      );
      if (uniqueValues.length > 0) {
        return { [column]: uniqueValues };
      }
    }
  }

  return null;
}

export { getNextColumnOptions };
