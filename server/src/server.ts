import { Command } from "commander";
import helmet from "helmet";
import express, { Express } from "express";
import cors from "cors";

import { getNextColumnOptions } from "./getNextColumnOptions";
import { parseCSV } from "./parseCSV";

// configure the CLI
const program = new Command();

program
  .name("server")
  .description("Runs the dynamic-forms api")
  .option("-p, --port <number>", "the port", parseInt);

program.parse();

const options = program.opts();

const PORT = options["port"] || 3001;

const app: Express = express();

const run = async () => {
  // enable CORS
  app.use(cors());

  // rudimentary security
  app.use(helmet());

  // reduce fingerprinting
  app.disable("x-powered-by");

  console.log("Loading csv data");

  // load the csv into memory
  const csvData = await parseCSV("./src/ceiling-construction.csv");

  console.log("Successfully loaded CSV data into memory");

  // healthcheck route
  app.get("/api/ping/", async (req, res) => {
    return res.send("pong");
  });

  // main API that
  app.get("/api/choices", async (req, res) => {
    console.log("GET /api/choices");

    // we know the input is exactly what we want, so safe to cast.
    // improvements could be made here for user validation.
    const selections = req.query as unknown as FormSelection;

    const choices = await getNextColumnOptions(csvData, selections);

    if (choices === null) {
      return res.status(400).end();
    } else {
      return res.json(choices);
    }
  });

  // launch the server on 3000 (default)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`server started at http://0.0.0.0:${PORT}`);
  });
};

run();
