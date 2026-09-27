/**
 * Editorial quality control — the ten-point checklist, mechanised.
 *
 * A machine can only catch the mechanical failures (banned phrases, invented
 * first-person experience, leaked prices, links to other review sites, missing
 * sections). It cannot judge whether the prose is genuinely good or whether the
 * reasoning is sound. So this module produces findings, never an approval:
 * `blocking` findings must be resolved before a human is asked to review, and
 * the review stays a draft either way.
 */

import type { ReviewSections } from "./prompt.js";

export type QcSeverity = "blocking" | "advisory";

export type QcFinding = {
  check: string;
  severity: QcSeverity;
  detail: string;
};

const BANNED_PHRASES = [
  "unforgettable olfactory journey",
  "olfactory journey",
  "captivating fragrance",
  "perfect for every occasion",
  "exudes confidence",
  "irresistible trail",
  "leaves an irresistible",
  "hidden gem",
  "game changer",
  "game-changer",
  "must-try",
  "must try",
  "scent that lingers",
  "sweeps you off",
  "seamless blend of",
  "masterpiece in a bottle",
  "a scent worth",
];

/** Phrases that would imply the writer smelled the bottle. */
const FIRST_PERSON_RISK = [
  /\bon my skin\b/i,
  /\bi sprayed\b/i,
  /\bi (?:sprayed|applied|wore|tested|tried)\b/i,
  /\bi personally\b/i,
  /\bwhen i (?:wore|sprayed|tested)\b/i,
  /\bwe (?:sprayed|wore|tested) (?:it|this)\b/i,
  /\bfrom my (?:own )?(?:testing|experience)\b/i,
];

/** Places a reader must never be sent from a review. */
const EXTERNAL_REVIEW_HOSTS = [
  "fragrantica.com",
  "parfumo.com",
  "basenotes.com",
  "boisdejasmin.com",
  "persolaise.com",
  "parfumo.net",
];

const REQUIRED_TEXT_SECTIONS: (keyof ReviewSections)[] = [
  "quickOverview",
  "scentDescription",
  "performance",
  "fragranceDevelopment",
  "whoIsItFor",
  "value",
  "take",
];

function allText(sections: ReviewSections): string {
  return [
    sections.quickOverview,
    sections.scentDescription,
    sections.performance,
    sections.fragranceDevelopment,
    sections.whoIsItFor,
    sections.value,
    sections.take,
    sections.strengths.join(" "),
    sections.considerations.join(" "),
    sections.scentProfile.map((p) => `${p.attribute} ${p.intensity}`).join(" "),
    sections.bestSeasons.map((s) => `${s.season} ${s.reason}`).join(" "),
    sections.bestOccasions.map((o) => `${o.occasion} ${o.reason}`).join(" "),
    sections.faq.map((f) => `${f.question} ${f.answer}`).join(" "),
  ].join("\n");
}

export function runQc(sections: ReviewSections): QcFinding[] {
  const findings: QcFinding[] = [];
  const text = allText(sections);

  // 1 — every section actually written
  for (const key of REQUIRED_TEXT_SECTIONS) {
    const value = sections[key];
    if (typeof value !== "string" || value.trim().length < 40) {
      findings.push({
        check: "sections-present",
        severity: "blocking",
        detail: `"${key}" is empty or too short to be publishable.`,
      });
    }
  }

  // 2 — no fabricated first-hand experience
  for (const pattern of FIRST_PERSON_RISK) {
    const hit = text.match(pattern);
    if (hit) {
      findings.push({
        check: "no-fake-first-hand",
        severity: "blocking",
        detail: `Found first-person testing language ("${hit[0]}"). PhiloFragrance does not claim to have tested the bottle.`,
      });
    }
  }

  // 3 — no marketing filler
  for (const phrase of BANNED_PHRASES) {
    if (text.toLowerCase().includes(phrase)) {
      findings.push({
        check: "no-marketing-filler",
        severity: "advisory",
        detail: `Banned phrase present: "${phrase}".`,
      });
    }
  }

  // 4 — no external review-site links or mentions
  const lower = text.toLowerCase();
  for (const host of EXTERNAL_REVIEW_HOSTS) {
    if (lower.includes(host.replace(/\.(com|net)/, ""))) {
      findings.push({
        check: "internal-links-only",
        severity: "blocking",
        detail: `References ${host}. Research sources must never be named to the reader.`,
      });
    }
  }

  // 5 — no hardcoded money in editorial prose
  const money = text.match(/(?:[$€£]\s?\d|\b\d+\s?%|\bUSD\b|\b\d{2,}\s?dollars?\b)/i);
  if (money) {
    findings.push({
      check: "no-prices-in-prose",
      severity: "blocking",
      detail: `Editorial text contains a price or discount ("${money[0]}"). Retail data belongs to retailer_offers.`,
    });
  }

  // 6 — no editorial score
  const score = text.match(/\b\d{1,2}\s?\/\s?10\b|editor'?s choice|\b\d(?:\.\d)?\s?stars?\b/i);
  if (score) {
    findings.push({
      check: "no-score",
      severity: "blocking",
      detail: `Contains a verdict score ("${score[0]}"). No PhiloFragrance scoring methodology exists yet.`,
    });
  }

  // 7 — performance is described, not measured
  if (!/vary|varies|depending|skin|climate|skin chemistry/i.test(sections.performance)) {
    findings.push({
      check: "performance-hedged",
      severity: "blocking",
      detail: "Performance section does not acknowledge that wear time varies with skin, climate or application.",
    });
  }
  if (/\b\d+\s?hours?\b/i.test(sections.performance)) {
    findings.push({
      check: "no-invented-timings",
      severity: "advisory",
      detail: "Performance section states a number of hours. Prefer qualitative strength over an invented measurement.",
    });
  }

  // 8 — structure the brief requires
  if (sections.faq.length < 4 || sections.faq.length > 7) {
    findings.push({
      check: "faq-count",
      severity: "advisory",
      detail: `FAQ has ${sections.faq.length} entries; the brief asks for 4–7.`,
    });
  }
  if (sections.similarFragrances.length < 3 || sections.similarFragrances.length > 5) {
    findings.push({
      check: "similar-count",
      severity: "advisory",
      detail: `"similar_fragrances" has ${sections.similarFragrances.length} entries; the brief asks for 3–5.`,
    });
  }
  if (sections.scentProfile.length < 4) {
    findings.push({
      check: "scent-profile-depth",
      severity: "advisory",
      detail: "Scent profile is thin. Prefer fewer, better-chosen attributes over a long list.",
    });
  }

  // 9 — the strongest section must actually be substantial
  if (sections.scentDescription.trim().length < 400) {
    findings.push({
      check: "scent-description-depth",
      severity: "advisory",
      detail: `"What does it smell like?" is short. The brief calls this the strongest section.`,
    });
  }

  // 10 — the scent description must not be a note list
  const noteList = /^\s*(top notes?|heart notes?|base notes?)\s*[:\-–]/im.test(sections.scentDescription);
  if (noteList) {
    findings.push({
      check: "scent-description-not-a-list",
      severity: "advisory",
      detail: "Scent description opens like a note list. Describe behaviour, not inventory.",
    });
  }

  return findings;
}

export function hasBlocking(findings: QcFinding[]): boolean {
  return findings.some((f) => f.severity === "blocking");
}
