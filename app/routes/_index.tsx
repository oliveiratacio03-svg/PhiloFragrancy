import {
  BrandFooter,
  BrandHeader,
  FeatureCard,
  GoldButton,
  fragranceSmokeImage,
  horizonImage,
} from "@/components/philofragrancy";

export function meta() {
  return [
    { title: "PHILOFRAGRANCY — The fragrance observatory" },
    {
      name: "description",
      content: "Coupons, reviews and intelligent perfume comparisons.",
    },
  ];
}

export default function HomeRoute() {
  return (
    <div className="philo-page">
      <BrandHeader />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <span className="eyebrow">The fragrance observatory · Est. 2025</span>
            <h1 id="hero-title">Find your<br /><em>signature.</em></h1>
            <p className="hero__note">Perfume, considered.</p>
            <GoldButton>Ver cupons</GoldButton>
          </div>
          <div className="hero__visual" aria-label="Translucent golden fragrance trails with glowing particles" role="img">
            <img className="hero__horizon" src={horizonImage} alt="Soft pink and blue twilight over the ocean" />
            <img className="hero__smoke" src={fragranceSmokeImage} alt="Translucent golden smoke with glowing particles" />
            <span className="hero__visual-caption">SCENT / 01</span>
          </div>
          <div className="hero__side-note">Beauty is<br />a point of view.</div>
          <div className="hero__scroll">Scroll to explore <span>↓</span></div>
        </section>

        <section className="intro" id="about" aria-labelledby="intro-title">
          <div className="ornamental-rule"><span /> <i /> <span /></div>
          <p className="eyebrow">A quieter way to choose scent</p>
          <h2 id="intro-title">The art of<br /><em>wearing well.</em></h2>
          <p className="intro__line">Independent insight for a more intentional collection.</p>
        </section>

        <section className="discovery" aria-labelledby="discovery-title">
          <div className="section-heading">
            <span className="section-number">01 — Discover</span>
            <h2 id="discovery-title">Begin here.</h2>
          </div>
          <div className="feature-grid">
            <FeatureCard number="01" label="Save beautifully" title="Cupons exclusivos" href="#coupons" />
            <FeatureCard number="02" label="Know the notes" title="Reviews detalhados" href="#reviews" />
            <FeatureCard number="03" label="Choose with clarity" title="Comparações inteligentes" href="#comparisons" />
          </div>
        </section>

        <section className="quiet-links" aria-label="Explore PHILOFRAGRANCY">
          <a id="coupons" href="#coupons" className="quiet-link">
            <span>Cupons</span><span>Selected offers / 02</span>
          </a>
          <a id="reviews" href="#reviews" className="quiet-link">
            <span>Reviews</span><span>Notes, trails, impressions / 03</span>
          </a>
          <a id="comparisons" href="#comparisons" className="quiet-link">
            <span>Comparações</span><span>Find your accord / 04</span>
          </a>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
