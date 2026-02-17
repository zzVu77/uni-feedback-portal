// loader.js
import "dotenv/config";
import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname reconstruction
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const DATASET_ID = "social_raw";
const TABLE_ID = "posts";
const PROJECT_ID = "uni-feedback-data";
// Note: KEY_PATH and actual BigQuery credentials setup should be verified.
// Based on previous code, KEY_PATH was missing or implied.
// If you have a key file, set it in .env or hardcode here.
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

async function loadDataToBigQuery() {
  const bqOptions = {
    projectId: PROJECT_ID,
  };

  if (KEY_PATH && fs.existsSync(KEY_PATH)) {
    bqOptions.keyFilename = KEY_PATH;
  }

  const bigquery = new BigQuery(bqOptions);

  // Search for the latest JSON file in the output directory (matching crawler logic)
  const outputDir = path.join(__dirname, "output");

  if (!fs.existsSync(outputDir)) {
    console.log("⚠️ Output directory not found.");
    return;
  }

  const files = fs
    .readdirSync(outputDir)
    .filter((file) => file.startsWith("posts_") && file.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log("⚠️ No data files found in output directory.");
    return;
  }

  const latestFile = files[0];
  const filePath = path.join(outputDir, latestFile);
  console.log(`📂 Reading file: ${latestFile}`);

  const rawData = fs.readFileSync(filePath, "utf8");
  const rows = JSON.parse(rawData);

  if (rows.length === 0) {
    console.log("⚠️ File is empty, skipping.");
    return;
  }

  const schema = [
    { name: "id", type: "INTEGER" },
    { name: "author", type: "STRING" },
    { name: "content", type: "STRING" },
    {
      name: "stats",
      type: "RECORD",
      fields: [
        { name: "reactions", type: "STRING" },
        { name: "comments", type: "STRING" },
      ],
    },
    { name: "crawled_at", type: "TIMESTAMP" },
  ];

  try {
    console.log(`🚀 Uploading ${rows.length} rows to BigQuery...`);

    await bigquery
      .dataset(DATASET_ID)
      .table(TABLE_ID)
      .insert(rows, { schema: schema });

    console.log(`✅ Success! Data loaded into ${DATASET_ID}.${TABLE_ID}`);
  } catch (error) {
    console.error("❌ Upload error:", JSON.stringify(error, null, 2));
    if (error.errors) {
      console.error("Error details:", error.errors);
    }
  }
}

if (process.argv[1] === __filename) {
  loadDataToBigQuery().catch(console.error);
}
