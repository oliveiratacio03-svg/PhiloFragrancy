import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

/**
 * Wishlist — a per-device convenience stored in localStorage.
 *
 * It is local on purpose: a saved list that needs an account is a wall in
 * front of the only job this site has, and there is no user table to hang a
 * synced list on. The tradeoff is that it does not follow the reader to
 * another device, which is why the button says "Saved" rather than implying a
 * collection exists anywhere else.
 */

const KEY = "philo:wishlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    // Private browsing and a full quota both throw here. A wishlist is not
    // worth an exception, so an unreadable list is an empty list.
    return [];
  }
}

function write(slugs: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    // Same reasoning: failing to persist must not break the toggle.
  }
}

export function useWishlist() {
  // Initialised empty so the first client render matches the server's. The
  // stored list arrives in the effect below, one frame later.
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(read());
  }, []);

  const toggle = (slug: string) => {
    setSlugs((current) => {
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      write(next);
      return next;
    });
  };

  return { slugs, toggle, has: (slug: string) => slugs.includes(slug) };
}

export function WishButton({ slug, name }: { slug: string; name: string }) {
  const wishlist = useWishlist();
  const saved = wishlist.has(slug);

  return (
    <button
      type="button"
      className="pf-wish"
      aria-pressed={saved}
      onClick={() => wishlist.toggle(slug)}
    >
      {saved ? <IconHeartFilled size={16} aria-hidden="true" /> : <IconHeart size={16} aria-hidden="true" />}
      {saved ? "Saved" : "Save"}
      <span className="sr-only"> {name} to your wishlist</span>
    </button>
  );
}
