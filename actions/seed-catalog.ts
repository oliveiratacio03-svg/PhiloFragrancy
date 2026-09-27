import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { seedCatalog } from "../server/lib/catalog/seed.js";

/**
 * Seed the canonical tables from the legacy catalog. Safe to re-run: it upserts
 * on slug and skips offers whose affiliate URL already exists, so it never
 * duplicates rows.
 */
export default defineAction({
  description:
    "Seed perfumes and retailer offers from the legacy catalog. Editorial prose and unsourced ratings are deliberately not migrated.",
  schema: z.object({}),
  run: async () => seedCatalog(),
});
