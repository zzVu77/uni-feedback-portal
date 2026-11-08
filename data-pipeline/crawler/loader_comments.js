// loader_comments.js
import "dotenv/config";
import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const DATASET_ID = "social_raw";
const TABLE_ID = "comments";
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || "uni-feedback-data";
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

/**
 * Loads the latest comments JSON file from crawler output into Google BigQuery.
 */
async function loadCommentsToBigQuery() {
  console.log("\n=======================================================");
  console.log("📥 Loading Scraped Comments into BigQuery (social_raw.comments)");
  console.log("=======================================================\n");

  const bqOptions = { projectId: PROJECT_ID };

  if (KEY_PATH && fs.existsSync(KEY_PATH)) {
    bqOptions.keyFilename = KEY_PATH;
  }

  const bigquery = new BigQuery(bqOptions);
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLE_ID);

  const outputDir = path.join(__dirname, "output");

  if (!fs.existsSync(outputDir)) {
    console.warn("⚠️ Output directory not found. Nothing to load.");
    return;
  }

  // Find the most recent comments file
  const files = fs
    .readdirSync(outputDir)
    .filter((file) => file.startsWith("comments_") && file.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.warn("⚠️ No comments JSON files found in output directory.");
    return;
  }

  const latestFile = files[0];
  const filePath = path.join(outputDir, latestFile);
  console.log(`📂 Reading latest comments file: ${latestFile}`);

  const rawData = fs.readFileSync(filePath, "utf8");
  const rows = JSON.parse(rawData);

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("ℹ️ Comments file is empty (0 comments). Skipping insert.");
    return;
  }

  console.log(`🚀 Inserting ${rows.length} comments into BigQuery table [${DATASET_ID}.${TABLE_ID}]...`);

  // Format and sanitize rows for BigQuery schema
  const sanitizedRows = rows.map((row) => ({
    comment_id: String(row.comment_id),
    post_id: String(row.post_id),
    parent_comment_id: row.parent_comment_id ? String(row.parent_comment_id) : null,
    author: String(row.author || "Sinh viên ẩn danh"),
    content: String(row.content || ""),
    reaction_count: typeof row.reaction_count === "number" ? row.reaction_count : 0,
    commented_at: row.commented_at ? new Date(row.commented_at).toISOString() : new Date().toISOString(),
    crawled_at: row.crawled_at ? new Date(row.crawled_at).toISOString() : new Date().toISOString(),
  }));

  try {
    // Insert rows in chunks of 500 to comply with BigQuery streaming limits
    const CHUNK_SIZE = 500;
    let totalInserted = 0;

    for (let i = 0; i < sanitizedRows.length; i += CHUNK_SIZE) {
      const chunk = sanitizedRows.slice(i, i + CHUNK_SIZE);
      await table.insert(chunk, { raw: false });
      totalInserted += chunk.length;
      console.log(`   ✅ Inserted chunk: ${totalInserted}/${sanitizedRows.length} rows.`);
    }

    console.log(`\n🎉 Successfully loaded ${totalInserted} comments into ${DATASET_ID}.${TABLE_ID}!`);
  } catch (error) {
    console.error("❌ Failed to insert comments into BigQuery:", error.message);
    if (error.errors) {
      console.error("   Detailed errors:", JSON.stringify(error.errors, null, 2));
    }
    process.exit(1);
  }
}

loadCommentsToBigQuery();
