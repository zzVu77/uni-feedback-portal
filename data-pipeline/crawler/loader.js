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
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

/**
 * Loads the latest JSON data from the crawler output into Google BigQuery.
 */
async function loadDataToBigQuery() {
  const bqOptions = {
    projectId: PROJECT_ID,
  };

  // Attach key file if it exists in the environment variables
  if (KEY_PATH && fs.existsSync(KEY_PATH)) {
    bqOptions.keyFilename = KEY_PATH;
  }

  const bigquery = new BigQuery(bqOptions);
  const outputDir = path.join(__dirname, "output");

  if (!fs.existsSync(outputDir)) {
    console.warn("⚠️ Output directory not found.");
    return;
  }

  // Find the most recent posts file
  const files = fs
    .readdirSync(outputDir)
    .filter((file) => file.startsWith("posts_") && file.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.warn("⚠️ No data files found in output directory.");
    return;
  }

  const latestFile = files[0];
  const filePath = path.join(outputDir, latestFile);
  console.log(`📂 Reading latest file: ${latestFile}`);

  const rawData = fs.readFileSync(filePath, "utf8");
  const rows = JSON.parse(rawData);

  if (rows.length === 0) {
    console.warn("⚠️ File is empty, skipping upload.");
    return;
  }

  // Sanitize data: BigQuery TIMESTAMP doesn't accept empty strings (""), it requires null or a valid date.
  const sanitizedRows = rows.map((row) => ({
    ...row,
    post_date: row.post_date === "" ? null : row.post_date,
  }));

  /**
   * BigQuery Table Schema
   * Updated to include post_link and post_date to match the crawler output format.
   */
  const schema = [
    { name: "id", type: "INTEGER" },
    { name: "author", type: "STRING" },
    { name: "post_date", type: "TIMESTAMP" },
    { name: "post_link", type: "STRING" },
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
    console.log(`🚀 Uploading ${sanitizedRows.length} rows to ${DATASET_ID}.${TABLE_ID}...`);

    await bigquery
      .dataset(DATASET_ID)
      .table(TABLE_ID)
      .insert(sanitizedRows, { schema: schema });

    console.log(`✅ Success! Data successfully loaded into BigQuery.`);
  } catch (error) {
    console.error("❌ BigQuery Upload Error:");
    if (error.errors) {
      console.error(JSON.stringify(error.errors, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

// Execute the loader if run directly via CLI
if (process.argv[1] === __filename) {
  loadDataToBigQuery().catch((err) => {
    console.error("❌ Fatal execution error:", err);
    process.exit(1);
  });
}
