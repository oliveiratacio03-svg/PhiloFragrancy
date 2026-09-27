import { defineNitroPlugin } from "@agent-native/core/server";
import { registerRequiredSecret } from "@agent-native/core/secrets";

/**
 * Credentials the review pipeline needs.
 *
 * Only the API key is registered — deliberately. The provider is inferred from
 * whichever key is present, and the model id is a per-provider default in
 * `server/lib/review/generate.ts`. That keeps setup to a single field instead of
 * asking an editor to type a provider name and a model string next to a masked
 * box they cannot read back.
 *
 * All three are optional so the app is usable (browsing, comparing offers)
 * before anyone configures generation. Each validator calls the provider's own
 * models endpoint, so a bad key is rejected at save time instead of failing
 * later inside a pipeline run.
 */
export default defineNitroPlugin(() => {
  registerRequiredSecret({
    key: "OPENAI_API_KEY",
    label: "OpenAI API key",
    description: "Lets PhiloFragrance draft fragrance reviews. Optional — the site works without it.",
    docsUrl: "https://platform.openai.com/api-keys",
    scope: "user",
    kind: "api-key",
    required: false,
    validator: async (value) => {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { authorization: `Bearer ${value}` },
      });
      return res.ok
        ? { ok: true }
        : { ok: false, error: `OpenAI rejected this key (HTTP ${res.status})` };
    },
  });

  registerRequiredSecret({
    key: "ANTHROPIC_API_KEY",
    label: "Anthropic API key",
    description: "Lets PhiloFragrance draft fragrance reviews. Optional — the site works without it.",
    docsUrl: "https://console.anthropic.com/settings/keys",
    scope: "user",
    kind: "api-key",
    required: false,
    validator: async (value) => {
      const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: { "x-api-key": value, "anthropic-version": "2023-06-01" },
      });
      return res.ok
        ? { ok: true }
        : { ok: false, error: `Anthropic rejected this key (HTTP ${res.status})` };
    },
  });

  registerRequiredSecret({
    key: "GOOGLE_GENERATIVE_AI_API_KEY",
    label: "Google AI API key",
    description: "Lets PhiloFragrance draft fragrance reviews. Optional — the site works without it.",
    docsUrl: "https://aistudio.google.com/apikey",
    scope: "user",
    kind: "api-key",
    required: false,
    validator: async (value) => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(value)}`,
      );
      return res.ok
        ? { ok: true }
        : { ok: false, error: `Google rejected this key (HTTP ${res.status})` };
    },
  });
});
