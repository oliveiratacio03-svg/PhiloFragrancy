import {
  BrandFooter,
  BrandHeader,
  FeaturedFragrances,
  FeatureCard,
  GoldButton,
  venusImage,
} from "@/components/philofragrancy";

export function meta() {
  return [
    { title: "PHILOFRAGRANCY — Perfume, considered" },
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
        <section className="hero hero--venus" aria-labelledby="hero-title">
          <img className="hero__venus" src={venusImage} alt="Golden textured Venus against a black background" />
          <div className="hero__overlay" />
          <div className="hero__copy">
            <h1 id="hero-title" style={{ marginLeft: "auto", marginRight: "auto" }}>PHILO<span>FRAGRANCY</span></h1>
            <p className="hero__note">Find your signature.</p>
            <GoldButton>Ver cupons</GoldButton>
          </div>
        </section>

        <FeaturedFragrances />

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
