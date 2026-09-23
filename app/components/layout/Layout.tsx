import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

const NAV_LINKS = [
  { href: "/#selection", label: "COUPONS" },
  { href: "/#reviews", label: "REVIEWS" },
  { href: "/#discover", label: "COMPARISONS" },
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
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#070707] text-[#e5e5e7]">
      {/* ── Minimalist Luxury Header (as in original reference) ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          backgroundColor: scrolled ? "rgba(7, 7, 7, 0.88)" : "transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 2rem",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo / Brand Name */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: "#f3f3f3",
                textTransform: "uppercase",
              }}
            >
              PHILO<span style={{ color: "#d4af37", fontStyle: "italic", marginLeft: "2px" }}>FRAGRANCY</span>
            </span>
          </Link>

          {/* Desktop Nav Links: COUPONS, REVIEWS, COMPARISONS, ABOUT */}
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.25rem",
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.16em",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.65)",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255, 255, 255, 0.65)";
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: EXPLORE ↗ */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <a
              href="/#selection"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.16em",
                fontWeight: 600,
                textDecoration: "none",
                color: "#d4af37",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              className="hidden sm:inline-flex"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
              }}
            >
              EXPLORE ↗
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="flex md:hidden"
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                width: "36px",
                height: "36px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "20px",
                    height: "1.5px",
                    backgroundColor: "#e5e5e7",
                    borderRadius: "1px",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "1.25rem 2rem",
              background: "#070707",
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  display: "block",
                  padding: "0.75rem 0",
                  fontSize: "0.875rem",
                  letterSpacing: "0.12em",
                  color: "#e5e5e7",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>

      {/* ── Luxury Minimalist Footer (Exact match to original reference) ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "3.5rem 2rem 2.5rem 2rem",
          backgroundColor: "#050505",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Left: A FRAGRANCE GUIDE / PHILOFRAGRANCY */}
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                color: "rgba(255, 255, 255, 0.4)",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
              }}
            >
              A FRAGRANCE GUIDE
            </div>
            <Link
              to="/"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.25rem",
                letterSpacing: "0.14em",
                fontWeight: 600,
                color: "#d4af37",
                textDecoration: "none",
              }}
            >
              PHILOFRAGRANCY
            </Link>
          </div>

          {/* Center Links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.75rem",
              alignItems: "center",
            }}
          >
            {[
              { href: "/#selection", label: "COUPONS" },
              { href: "/#reviews", label: "REVIEWS" },
              { href: "/#discover", label: "COMPARISONS" },
              { href: "/about", label: "ABOUT" },
              { href: "/disclosure", label: "AFFILIATE DISCLOSURE" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.16em",
                  color: "rgba(255, 255, 255, 0.6)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255, 255, 255, 0.6)";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right: Copyright */}
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              color: "rgba(255, 255, 255, 0.4)",
              textTransform: "uppercase",
            }}
          >
            © 2026 PHILOFRAGRANCY · MADE FOR THE SENSES
          </div>
        </div>

        {/* Affiliate & Google Ads Transparency Notice */}
        <div
          style={{
            maxWidth: "1320px",
            margin: "2rem auto 0 auto",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            fontSize: "0.72rem",
            color: "rgba(255, 255, 255, 0.35)",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          PhiloFragrancy is an independent editorial platform dedicated to fragrance artistry. We partner with vetted luxury retailers (FragranceNet, Sephora, Nordstrom, etc.). When you redeem a coupon or complete a purchase via our links, we may earn an affiliate commission at no extra cost to you. All fragrance reviews and evaluations are independently conducted by our editorial panel.
        </div>
      </footer>
    </div>
  );
}
