/**
 * The writer.
 *
 * No review model is configured in this project yet, so this module is
 * deliberately inert: it looks for a stored API key on the calling account and
 * throws an actionable error instead of silently returning empty text or a
 * fabricated review. The pipeline around it is fully wired and testable without
 * a key.
 *
 * Keys are read with `resolveCredential`, never `process.env` — env vars are
 * global to the deployment and would leak across users. The provider is inferred
 * from whichever key the account has saved (see
 * `server/plugins/register-secrets.ts`), so setup is a single field. The model
 * id is a per-provider default here on purpose: a provider renaming a model is
 * then a one-line change rather than a hidden setting nobody can read back.
 */

import { resolveCredential, type CredentialContext } from "@agent-native/core/credentials";
import type { ReviewSections } from "./prompt.js";

export class ReviewGenerationNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewGenerationNotConfiguredError";
  }
}

type Provider = {
  name: string;
  credentialKey: string;
  defaultModel: string;
  load: (apiKey: string, model: string) => Promise<unknown>;
};

const PROVIDERS: Provider[] = [
  {
    name: "openai",
    credentialKey: "OPENAI_API_KEY",
    defaultModel: "gpt-4o",
    load: async (apiKey, model) => {
      const { createOpenAI } = await import("@ai-sdk/openai");
      return createOpenAI({ apiKey })(model);
    },
  },
  {
    name: "anthropic",
    credentialKey: "ANTHROPIC_API_KEY",
    defaultModel: "claude-sonnet-4-5",
    load: async (apiKey, model) => {
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      return createAnthropic({ apiKey })(model);
    },
  },
  {
    name: "google",
    credentialKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    defaultModel: "gemini-2.0-flash",
    load: async (apiKey, model) => {
      const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
      return createGoogleGenerativeAI({ apiKey })(model);
    },
  },
];

export type GenerationResult = {
  sections: ReviewSections;
  model: string;
  provider: string;
};

export type GenerationStatus = {
  configured: boolean;
  provider: string;
  model: string;
  missing: string[];
};

/** First provider with a stored key wins; reports every option when none is set. */
export async function resolveProvider(
  ctx: CredentialContext,
): Promise<{ provider: Provider; apiKey: string } | null> {
  for (const provider of PROVIDERS) {
    const apiKey = await resolveCredential(provider.credentialKey, ctx);
    if (apiKey) return { provider, apiKey };
  }
  return null;
}

export async function generationStatus(ctx: CredentialContext): Promise<GenerationStatus> {
  const found = await resolveProvider(ctx);
  if (!found) {
    return { configured: false, provider: "", model: "", missing: PROVIDERS.map((p) => p.credentialKey) };
  }
  return { configured: true, provider: found.provider.name, model: found.provider.defaultModel, missing: [] };
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first === -1 || last <= first) throw new Error("model did not return JSON");
    return JSON.parse(trimmed.slice(first, last + 1));
  }
}

function normalise(input: unknown): ReviewSections {
  const raw = input as Record<string, unknown>;
  if (!raw || typeof raw !== "object") throw new Error("model returned a non-object payload");

  const str = (key: string): string => (typeof raw[key] === "string" ? (raw[key] as string) : "");
  const strList = (key: string): string[] =>
    Array.isArray(raw[key]) ? (raw[key] as unknown[]).filter((v): v is string => typeof v === "string") : [];

  const breakdown = (raw.note_breakdown ?? {}) as Record<string, unknown>;

  return {
    quickOverview: str("quick_overview"),
    scentDescription: str("scent_description"),
    noteBreakdown: {
      top: Array.isArray(breakdown.top) ? (breakdown.top as string[]) : [],
      heart: Array.isArray(breakdown.heart) ? (breakdown.heart as string[]) : [],
      base: Array.isArray(breakdown.base) ? (breakdown.base as string[]) : [],
      source: typeof breakdown.source === "string" ? breakdown.source : "",
    },
    scentProfile: (Array.isArray(raw.scent_profile) ? raw.scent_profile : []).map((entry) => {
      const e = entry as Record<string, unknown>;
      return {
        attribute: typeof e.attribute === "string" ? e.attribute : "",
        intensity: (["subtle", "moderate", "prominent"] as const).find((i) => i === e.intensity) ?? "moderate",
      };
    }),
    performance: str("performance"),
    fragranceDevelopment: str("fragrance_development"),
    bestSeasons: (Array.isArray(raw.best_seasons) ? raw.best_seasons : []).map((entry) => {
      const e = entry as Record<string, unknown>;
      return { season: typeof e.season === "string" ? e.season : "", reason: typeof e.reason === "string" ? e.reason : "" };
    }),
    bestOccasions: (Array.isArray(raw.best_occasions) ? raw.best_occasions : []).map((entry) => {
      const e = entry as Record<string, unknown>;
      return { occasion: typeof e.occasion === "string" ? e.occasion : "", reason: typeof e.reason === "string" ? e.reason : "" };
    }),
    whoIsItFor: str("who_is_it_for"),
    strengths: strList("strengths"),
    considerations: strList("considerations"),
    value: str("value"),
    similarFragrances: strList("similar_fragrances"),
    take: str("take"),
    faq: (Array.isArray(raw.faq) ? raw.faq : []).map((entry) => {
      const e = entry as Record<string, unknown>;
      return {
        question: typeof e.question === "string" ? e.question : "",
        answer: typeof e.answer === "string" ? e.answer : "",
      };
    }),
  };
}

export async function generateReview(prompt: string, ctx: CredentialContext): Promise<GenerationResult> {
  const found = await resolveProvider(ctx);
  if (!found) {
    throw new ReviewGenerationNotConfiguredError(
      `No review model is configured for this account. Save one of ${PROVIDERS.map((p) => p.credentialKey).join(", ")} ` +
        "in settings, then run this action again. Nothing was written and no review was published.",
    );
  }

  const { generateText } = await import("ai");
  const model = await found.provider.load(found.apiKey, found.provider.defaultModel);

  const { text } = await generateText({
    model: model as Parameters<typeof generateText>[0]["model"],
    prompt,
    temperature: 0.7,
  });

  return {
    sections: normalise(extractJson(text)),
    model: found.provider.defaultModel,
    provider: found.provider.name,
  };
}
