import { Supplement, SupplementCombination } from "./types";

const DEFAULT_R2_EIGEN_ENDPOINT =
  "https://zudslxucibosjwefojtm.supabase.co/functions/v1/eigen-ingest";
const MAX_INGEST_BODY_CHARS = 60_000;

interface HealthSupplementIngestConfig {
  endpoint?: string;
  bearerToken?: string;
}

interface HealthSupplementIngestSnapshot {
  supplements: Supplement[];
  combinations: SupplementCombination[];
  sourcesQueried: string[];
}

export async function ingestHealthSupplementSnapshot(
  config: HealthSupplementIngestConfig,
  snapshot: HealthSupplementIngestSnapshot,
): Promise<void> {
  if (!config.bearerToken) return;

  const endpoint = config.endpoint ?? DEFAULT_R2_EIGEN_ENDPOINT;
  const ingestRun = {
    id: crypto.randomUUID(),
    source_system: "health-supplement-tr",
    started_at: new Date().toISOString(),
    trigger: "client_update",
  };

  const bodyPayload = {
    generated_at: new Date().toISOString(),
    supplement_count: snapshot.supplements.length,
    combination_count: snapshot.combinations.length,
    supplements: snapshot.supplements.slice(0, 25),
    combinations: snapshot.combinations.slice(0, 25),
  };
  const rawBody = JSON.stringify(bodyPayload);
  const clippedBody =
    rawBody.length > MAX_INGEST_BODY_CHARS
      ? `${rawBody.slice(0, MAX_INGEST_BODY_CHARS)}\n\n[truncated_for_ingest=true]`
      : rawBody;

  const payload = {
    source_system: "health-supplement-tr",
    source_ref: `daily-update:${new Date().toISOString()}`,
    document: {
      title: "Health Supplement trend refresh snapshot",
      body: clippedBody,
      content_type: "health_supplement_trend_refresh",
      metadata: {
        generated_at: new Date().toISOString(),
        ingest_body_truncated: rawBody.length > MAX_INGEST_BODY_CHARS,
        ingest_run: ingestRun,
        evidence_tier: "domain_export",
        sources_queried: snapshot.sourcesQueried,
        adversarial_pass: false,
        registry_verified_ratio: null,
      },
    },
    chunking_mode: "hierarchical",
    policy_tags: ["health-supplement-tr", "trend-refresh"],
    entity_ids: [],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.bearerToken}`,
      "x-idempotency-key": `health-supplement-tr:${payload.source_ref}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Ingest request failed (${response.status}): ${errorText.slice(0, 300)}`);
  }
}
