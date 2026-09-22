import type { ReactNode } from "react";
import { Link } from "react-router";

const horizonImage =
  "https://cdn.builder.io/api/v1/image/assets%2F3cdea08be76f4cf0854cd79b703ae4de%2Fb9688386b84e4067ba37e446428eac20?format=webp&width=800&height=1200";
const fragranceSmokeImage =
  "https://cdn.builder.io/api/v1/image/assets%2F3cdea08be76f4cf0854cd79b703ae4de%2F0242d0a115ba4dc8ae5e23b8cf08422a?format=webp&width=800&height=1200";

export function BrandHeader() {
  return (
    <header className="site-header">
      <Link className="brand-mark" to="/" aria-label="PHILOFRAGRANCY home">
        <span className="brand-mark__ornament">·</span>
        <span>PHILOFRAGRANCY</span>
        <span className="brand-mark__ornament">·</span>
      </Link>
      <nav aria-label="Primary navigation" className="site-nav">
        <a href="#coupons">Cupons</a>
        <a href="#reviews">Reviews</a>
        <a href="#comparisons">Comparações</a>
        <a href="#about">Sobre</a>
      </nav>
      <a href="#coupons" className="header-action">
        Explorar
      </a>
    </header>
  );
}

export function GoldButton({ children, href = "#coupons" }: { children: ReactNode; href?: string }) {
  return (
    <a className="gold-button" href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

interface FeatureCardProps {
  number: string;
  title: string;
  label: string;
  href: string;
}

export function FeatureCard({ number, title, label, href }: FeatureCardProps) {
  return (
    <a className="feature-card" href={href}>
      <div className="feature-card__topline">
        <span>{number}</span>
        <span className="feature-card__seal" aria-hidden="true" />
      </div>
      <div>
        <span className="eyebrow">{label}</span>
        <h3>{title}</h3>
      </div>
      <span className="feature-card__arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export function BrandFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="footer-kicker">A fragrance observatory</span>
        <p className="footer-brand">PHILOFRAGRANCY</p>
      </div>
      <div className="footer-links">
        <a href="#coupons">Cupons</a>
        <a href="#reviews">Reviews</a>
        <a href="#comparisons">Comparações</a>
        <a href="mailto:hello@philofragrancy.com">Contato</a>
      </div>
      <div className="footer-meta">
        <span>© 2025 PHILOFRAGRANCY</span>
        <span>Made for the senses</span>
      </div>
    </footer>
  );
}

export { fragranceSmokeImage, horizonImage };
