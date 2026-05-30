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
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLE_ID);

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

  // Sanitize data
  const sanitizedRows = rows.map((row) => ({
    ...row,
    post_date: row.post_date === "" ? null : row.post_date,
  }));

  /**
   * BigQuery Table Schema
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
    let [exists] = await table.exists();

    // --- LOGIC TỰ CHỮA LÀNH BẢNG LỖI ---
    if (exists) {
      const [metadata] = await table.getMetadata();
      // Nếu bảng tồn tại nhưng không có schema, ta xóa nó đi để tạo lại
      if (!metadata.schema || !metadata.schema.fields) {
        console.warn(
          `⚠️ Table ${TABLE_ID} exists but has NO SCHEMA. Dropping it to start fresh...`,
        );
        await table.delete();
        exists = false; // Báo hiệu là bảng không còn nữa để block dưới tạo lại
      }
    }
    // -----------------------------------

    if (!exists) {
      console.log(
        `🏗️ Table ${TABLE_ID} does not exist. Creating with schema and partitioning...`,
      );

      const options = {
        schema: schema,
        timePartitioning: {
          type: "DAY",
          field: "crawled_at",
        },
      };

      await dataset.createTable(TABLE_ID, options);
      console.log(`✅ Table created successfully with DAY partitioning.`);

      // Đợi 2 giây để BigQuery kịp đồng bộ metadata trước khi insert dữ liệu
      await new Promise((r) => setTimeout(r, 2000));
    }

    console.log(
      `🚀 Uploading ${sanitizedRows.length} rows to ${DATASET_ID}.${TABLE_ID}...`,
    );

    // Không cần truyền { schema: schema } vào đây nữa vì bảng đã được tạo chuẩn ở trên
    await table.insert(sanitizedRows);

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
