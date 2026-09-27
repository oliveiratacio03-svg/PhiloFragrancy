import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

/**
 * Nav targets. Every one of these resolves to a section or route that exists —
 * the previous list carried two separate entries pointing at `#compare`, one of
 * them labelled COUPONS, for a coupon section this site no longer has.
 */
const NAV_LINKS = [
  { href: "/search", label: "SEARCH" },
  { href: "/#featured", label: "OFFERS" },
  { href: "/#compare", label: "COMPARE" },
  { href: "/#reviews", label: "REVIEWS" },
  { href: "/about", label: "ABOUT" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    /* `key` on the whole location, not just the pathname: tapping a #anchor on
       the page you are already on changes the hash and nothing else, and the
       mobile menu has to close for that case too. */
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#070707] text-[#e5e5e7]">
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? "border-b border-white/10 bg-[#070707]/90 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="pf-container flex h-[72px] items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="PhiloFragrancy home">
            <span
              className="text-[1.25rem] font-semibold uppercase text-[#f3f3f3]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.14em" }}
            >
              Philo<span className="ml-[2px] italic text-[#d4af37]">fragrance</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.href} className="pf-navlink">
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 border-0 bg-transparent p-0 md:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-px w-5 bg-[#e5e5e7]"
                style={{
                  transform: mobileOpen && i === 0 ? "translateY(5.5px) rotate(45deg)" : undefined,
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                  transformOrigin: "center",
                  transition: "transform 0.25s ease, opacity 0.2s ease",
                }}
              />
            ))}
          </button>
        </div>

        {mobileOpen && (
          <nav aria-label="Mobile" className="border-t border-white/10 bg-[#070707] md:hidden">
            <div className="pf-container flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/5 py-4 text-[0.8rem] tracking-[0.14em] text-[#e5e5e7] no-underline last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>

      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="pf-container flex flex-col gap-10 py-16">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div>
              <p className="pf-meta">A fragrance guide</p>
              <Link
                to="/"
                className="pf-link pf-link--gold mt-2 inline-block text-[1.15rem]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.14em" }}
              >
                PhiloFragrancy
              </Link>
            </div>

            <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
              {[...NAV_LINKS, { href: "/disclosure", label: "DISCLOSURE" }].map((item) => (
                <Link key={item.label} to={item.href} className="pf-navlink">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
            <p className="pf-meta">© 2026 PhiloFragrancy</p>
            <p className="max-w-[640px] text-[0.78rem] leading-[1.7] text-white/45">
              PhiloFragrance is an independent fragrance publication. Some links on PhiloFragrance are affiliate links.
              We may earn a commission when you purchase through them, at no additional cost to you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
