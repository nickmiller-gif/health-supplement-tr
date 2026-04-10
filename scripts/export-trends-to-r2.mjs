import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const SUPABASE_URL = process.env.HST_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.HST_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const R2_EIGEN_INGEST_ENDPOINT =
  process.env.R2_EIGEN_INGEST_ENDPOINT ??
  "https://zudslxucibosjwefojtm.supabase.co/functions/v1/eigen-ingest";
const R2_EIGEN_INGEST_BEARER_TOKEN = process.env.R2_EIGEN_INGEST_BEARER_TOKEN;
const ENABLE_R2_EIGEN_INGEST = process.env.ENABLE_R2_EIGEN_INGEST === "true";
const DRY_RUN = process.env.HST_EIGEN_DRY_RUN === "true";
const INGEST_TIMEOUT_MS = Number(process.env.HST_EIGEN_INGEST_TIMEOUT_MS ?? "12000");

const EXPORT_LIMIT = Number(process.env.HST_EXPORT_LIMIT ?? "100");
const MAX_INGEST_BODY_CHARS = Number(process.env.HST_EIGEN_MAX_BODY_CHARS ?? "60000");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing HST_SUPABASE_URL/SUPABASE_URL or HST_SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}
if (!R2_EIGEN_INGEST_BEARER_TOKEN && !DRY_RUN) {
  console.error("Missing R2_EIGEN_INGEST_BEARER_TOKEN");
  process.exit(1);
}
if (!ENABLE_R2_EIGEN_INGEST && !DRY_RUN) {
  console.error("Set ENABLE_R2_EIGEN_INGEST=true to run export (or HST_EIGEN_DRY_RUN=true)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function stableSourceRef(table, row) {
  const rowId = row.id ?? row.uuid ?? row.slug ?? null;
  if (rowId) return `${table}:${rowId}`;
  const digest = createHash("sha256")
    .update(JSON.stringify(row))
    .digest("hex")
    .slice(0, 16);
  return `${table}:${digest}`;
}

function rowToDocument(table, row) {
  const title =
    row.name ??
    row.title ??
    row.signal ??
    row.stack_name ??
    row.trend_name ??
    `${table} record`;

  const sourceRef = stableSourceRef(table, row);
  const policyTags = ["health-supplement-tr", "trend-intelligence"];

  if (table === "supplements") policyTags.push("supplement-trend");
  if (table === "supplement_combinations") policyTags.push("supplement-stack");
  if (table === "emerging_signals") policyTags.push("emerging-signal");

  const rawBody = [
    `Source table: ${table}`,
    "",
    "Trend payload:",
    JSON.stringify(row, null, 2),
  ].join("\n");
  const body =
    rawBody.length > MAX_INGEST_BODY_CHARS
      ? `${rawBody.slice(0, MAX_INGEST_BODY_CHARS)}\n\n[truncated_for_ingest=true]`
      : rawBody;

  return {
    source_system: "health-supplement-tr",
    source_ref: sourceRef,
    document: {
      title: String(title),
      body,
      content_type: "health_trend_export",
      metadata: {
        table,
        exported_at: new Date().toISOString(),
        row_id: row.id ?? null,
        updated_at: row.updated_at ?? null,
        ingest_body_truncated: rawBody.length > MAX_INGEST_BODY_CHARS,
      },
    },
    chunking_mode: "hierarchical",
    policy_tags: policyTags,
    entity_ids: [],
  };
}

async function ingest(payload) {
  if (DRY_RUN) {
    console.log(`[dry-run] would ingest ${payload.source_ref}`);
    return;
  }

  const retryDelaysMs = [0, 800, 1800];
  let lastError = null;

  for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
    if (retryDelaysMs[attempt] > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt]));
    }
    try {
      const response = await fetch(R2_EIGEN_INGEST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${R2_EIGEN_INGEST_BEARER_TOKEN}`,
          "x-idempotency-key": `health-supplement-tr:${payload.source_ref}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(INGEST_TIMEOUT_MS),
      });

      if (response.ok) return;
      lastError = `status=${response.status} body=${(await response.text()).slice(0, 300)}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(`Ingest failed for ${payload.source_ref}: ${lastError}`);
}

async function exportTable(table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(EXPORT_LIMIT);

  if (error) {
    throw new Error(`Failed to read ${table}: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  let ok = 0;
  for (const row of rows) {
    const payload = rowToDocument(table, row);
    await ingest(payload);
    ok += 1;
  }
  return { table, count: ok };
}

async function main() {
  const tables = ["supplements", "supplement_combinations", "emerging_signals"];
  const summary = [];
  for (const table of tables) {
    summary.push(await exportTable(table));
  }
  console.log("Health supplement export complete", summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
