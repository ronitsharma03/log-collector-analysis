const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvFilePath = path.join(__dirname, "syslogs.csv");
const csvFilePath2 = path.join(__dirname, "bootlogs.csv");


const csvWriter = createCsvWriter({
  path: csvFilePath,
  header: [
    { id: "timestamp", title: "Timestamp" },
    { id: "host", title: "Host" },
    { id: "source", title: "Source" },
    { id: "raw_log", title: "Raw_Log" },
  ],
});

const parseAndSaveLog = async (logFilePath) => {
  const logData = fs.readFileSync(logFilePath, "utf-8").split("\n");

  const records = [];

  for (let line of logData) {
    if (line.trim()) {
      const logParts = line.match(/^(\S+T\S+\+\S+)\s+(\S+)\s+(\S+):\s+(.*)$/);


      if (logParts) {
        const [, timestamp, host, kernelMessage, rawLog] = logParts;
        records.push({
          timestamp: new Date(timestamp).toISOString(),
          host: host,
          source: "syslog",
          Kernel_Message: kernelMessage,
          raw_log: rawLog,
        });
      }
    }
  }

  csvWriter
    .writeRecords(records)
    .then(() => {
      console.log("Log saved to CSV successfully!");
    })
    .catch((err) => {
      console.log("Error saving the log");
    });
};

// parseAndSaveLog("/var/log/syslog");


// Create the CSV writer
const csvWriter2 = createCsvWriter({
  path: csvFilePath2,
  header: [
    { id: "timestamp", title: "Timestamp" },
    { id: "status", title: "Status" },
    { id: "service", title: "Service" },
    { id: "description", title: "Description" },
  ],
});

// Function to parse and save the boot log
const parseAndSaveBootLog = async (logFilePath) => {
  const logData = fs.readFileSync(logFilePath, "utf-8").split("\n");

  const records = [];

  for (let line of logData) {
    if (line.trim()) {
      // const logParts = line.match(/^(\S\s\S+\s\S+)\s+(\S+)\s+(\S+):\s+(.*)$/);
      const logParts = line.match(/^\[\s*\w+\s*\]\s+(.+?)\s+-\s+(.*)$/);


      if (logParts) {
        const [timestamp, host, kernelMessage, rawLog] = logParts;
        records.push({
          timestamp: new Date(timestamp).toISOString(),
          host: host,
          source: "bootlog",
          raw_log: rawLog,
        });
      }
    }
  }

  console.log(records);

  // Write parsed logs to the CSV file
  csvWriter2
    .writeRecords(records)
    .then(() => {
      console.log("Boot logs saved to CSV successfully!");
    })
    .catch((err) => {
      console.error("Error saving the boot logs to CSV:", err);
    });
};

parseAndSaveBootLog('/var/log/boot.log');
