import type { ReactNode } from "react";
import { Link } from "react-router";

const venusImage =
  "https://cdn.builder.io/api/v1/image/assets%2F3cdea08be76f4cf0854cd79b703ae4de%2F1073a55adef145c2a5ef58c792968c08?format=webp&width=800&height=1200";

const featuredFragrances = [
  {
    name: "Bleu de Chanel",
    brand: "CHANEL · Eau de Parfum",
    image: "https://cdn.builder.io/api/v1/image/assets%2F3cdea08be76f4cf0854cd79b703ae4de%2Fe1fbd08a5cc644ceb84b24cea6320c89?format=webp&width=800&height=1200",
  },
  {
    name: "Aventus",
    brand: "CREED · Eau de Parfum",
    image: "https://cdn.builder.io/api/v1/image/assets%2F3cdea08be76f4cf0854cd79b703ae4de%2Fe3da5947eada4c75b94e625e7ca6ba70?format=webp&width=800&height=1200",
  },
  {
    name: "Sauvage Parfum",
    brand: "DIOR · Parfum",
    image: "https://cdn.builder.io/api/v1/image/assets%2F3cdea08be76f4cf0854cd79b703ae4de%2F091102ee4274470998dffe0f300830db?format=webp&width=800&height=1200",
  },
];

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

export function ProductCard({ name, brand, image }: (typeof featuredFragrances)[number]) {
  return (
    <a className="product-card" href="#coupons">
      <div className="product-card__image-wrap">
        <img className="product-card__image" src={image} alt={`${name} perfume bottle`} />
      </div>
      <div className="product-card__details">
        <div>
          <h3>{name}</h3>
          <span>{brand}</span>
        </div>
        <span className="product-card__link">Ver cupom <b aria-hidden="true">↗</b></span>
      </div>
    </a>
  );
}

export function FeaturedFragrances() {
  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="featured__heading">
        <span className="section-number">01 — Selection</span>
        <h2 id="featured-title">Fragrâncias<br /><em>em destaque.</em></h2>
        <p>Seleções que merecem ser sentidas.</p>
      </div>
      <div className="product-grid">
        {featuredFragrances.map((fragrance) => <ProductCard key={fragrance.name} {...fragrance} />)}
      </div>
    </section>
  );
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
        <span className="footer-kicker">A fragrance guide</span>
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

export { venusImage };
