/// <reference types="../src/types.d.ts" />

import { beforeAll, describe, expect, it, vi } from "vitest";

import { parseCSV } from "../src/parseCSV";
import { getNextColumnOptions } from "../src/getNextColumnOptions";

describe("options test", () => {
  let csvData;

  beforeAll(async () => {
    csvData = await parseCSV("./src/ceiling-construction.csv");
  });

  it("should load a file that has 1126 element", () => {
    expect(csvData.length).toBe(1126);
  });

  it("should return 18A-15 ad", async () => {
    const selections: FormSelection = {
      "Ceiling type": "Ceiling below roof joists",
      "Roofing material": "Asphalt shingles",
      "Roof color": "Dark",
      Insulation: "Blanket or loose fill",
      "R-value": "R-21",
    };

    const choices = await getNextColumnOptions(csvData, selections);

    expect(choices).toStrictEqual({
      "Extended Construction Numbers": ["18A-21 ad"],
    });
  });

  it("should return 18A-2 md", async () => {
    const selections: FormSelection = {
      "Ceiling type": "Ceiling below roof joists",
      "Roofing material": "Metal",
      "Roof color": "Dark",
      Insulation: "Board insulation",
      "R-value": "R-2",
    };

    const choices = await getNextColumnOptions(csvData, selections);

    expect(choices).toStrictEqual({
      "Extended Construction Numbers": ["18A-2 md"],
    });
  });

  it("should return 18B-0 ww", async () => {
    const selections: FormSelection = {
      "Ceiling type": "Ceiling below roof joists",
      "Roofing material": "Wood shakes",
      "Roof color": "White",
      Insulation: "None",
      "R-value": "",
    };

    const choices = await getNextColumnOptions(csvData, selections);

    expect(choices).toStrictEqual({
      "Extended Construction Numbers": ["18B-0 ww"],
    });
  });

  it("should return 17A-7 ad", async () => {
    const selections: FormSelection = {
      "Ceiling type": "Ceiling on exposed beams",
      "Deck construction": '"1.5"" wood"',
      "Roofing material": "Asphalt shingles",
      "Roof color": "Dark",
      "R-value": "R-7",
    };

    const choices = await getNextColumnOptions(csvData, selections);

    expect(choices).toStrictEqual({
      "Extended Construction Numbers": ["17A-7 ad"],
    });
  });

  it("should return 16FR-28 zw", async () => {
    const selections: FormSelection = {
      "Ceiling type": "Ceiling under attic or attic knee wall",
      "Attic ventilation": "FHA vented",
      "Attic fan": "No",
      "Radiant barrier": "Yes",
      "Roofing material": "Membrane",
      "Roof color": "White",
      "R-value": "R-28",
    };

    const choices = await getNextColumnOptions(csvData, selections);

    expect(choices).toStrictEqual({
      "Extended Construction Numbers": ["16FR-28 zw"],
    });
  });

  it("should return 16CR-0 ww", async () => {
    const selections: FormSelection = {
      "Ceiling type": "Ceiling under attic or attic knee wall",
      "Attic ventilation": "FHA vented",
      "Attic fan": "No",
      "Radiant barrier": "Yes",
      "Roofing material": "Wood shakes",
      "Roof color": "White",
      "R-value": "None",
    };

    const choices = await getNextColumnOptions(csvData, selections);

    expect(choices).toStrictEqual({
      "Extended Construction Numbers": ["16CR-0 ww"],
    });
  });
});
