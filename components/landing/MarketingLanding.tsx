import Image from "next/image";
import { MarketingHero } from "@/components/landing/MarketingHero";
import { MobileCtaBar } from "@/components/landing/mobile-cta-bar";
import { RevealInit } from "@/components/landing/reveal-init";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { landingLinks } from "@/lib/landing-links";
import { siteImages } from "@/lib/site-images";

const steps = [
  {
    num: "1",
    title: "Read",
    body: "Gesi Stories—histories from contributors, historians, and communities who know each place.",
    image: siteImages.archive,
    alt: "Open books and reading light in a study",
  },
  {
    num: "2",
    title: "Plan",
    body: "Tours & Travel maps your visit from the story—Gesi-curated and verified partner listings.",
    image: siteImages.featuredHeritage,
    alt: "Ancient stone heritage site",
  },
  {
    num: "3",
    title: "Request",
    body: "Submit a trip request. No payment online—Gesi coordinates with custodians and verified partners.",
    image: siteImages.journey,
    alt: "Travelers on a road through open landscape",
  },
];

const audiences = [
  {
    title: "Travelers",
    body: "Read the history, then explore Tours & Travel—wherever you live.",
    cta: "Explore tours",
    href: landingLinks.visit,
    image: siteImages.journey,
    alt: "Road trip through scenic landscape",
  },
  {
    title: "Contributors",
    body: "Publish the sites you know on Gesi. Your name, your region.",
    cta: "Contribute",
    href: landingLinks.contribute,
    image: siteImages.archive,
    alt: "Archive and reading materials",
  },
  {
    title: "Tourism partners",
    body: "Apply as a verified partner, manage tours, and claim Gesi-curated listings that represent you.",
    cta: "Become a partner",
    href: landingLinks.partner,
    image: siteImages.featuredHeritage,
    alt: "Heritage stonework at a historic site",
  },
];

const activeRegions = [
  "West Africa",
  "East Africa",
  "Southern Africa",
  "North Africa",
  "Central Africa",
  "Diaspora",
];

export function MarketingLanding() {
  return (
    <RevealInit>
      <ScrollProgress />
      <header className="site-header">
        <div className="landing-container nav-wrap">
          <a href="#top" className="brand">
            <span className="brand-mark" aria-hidden>
              G
            </span>
            <span>Gesi</span>
          </a>
          <nav className="main-nav" aria-label="Main">
            <a href={landingLinks.explore}>Explore</a>
            <a href="#how">How it works</a>
            <a href="#join">Join</a>
            <a href={landingLinks.contribute}>Contribute</a>
            <a href={landingLinks.partner}>Partners</a>
          </nav>
          <div className="nav-actions">
            <a href={landingLinks.explore} className="nav-explore">
              Enter Gesi <span aria-hidden>→</span>
            </a>
            <a href={landingLinks.visit} className="btn btn-small btn-platform-primary nav-cta">
              Explore tours
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <MarketingHero />

        <section className="section launch-strip">
          <div className="landing-container reveal">
            <p className="launch-strip-label platform-label platform-label-soft">Active across</p>
            <ul className="launch-regions">
              {activeRegions.map((region) => (
                <li key={region}>{region}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="story-spotlight" aria-labelledby="spotlight-title">
          <div className="landing-container spotlight-grid reveal">
            <div className="spotlight-frame">
              <Image
                src={siteImages.featuredHeritage}
                alt="Stone walls at a southern African heritage site"
                width={1200}
                height={900}
                className="spotlight-photo"
                priority
              />
            </div>
            <div className="spotlight-copy">
              <p className="platform-label spotlight-eyebrow">
                <span className="spotlight-rule" aria-hidden />
                Example flow
              </p>
              <h2 id="spotlight-title" className="spotlight-title">
                The story on the page. The path on the ground.
              </h2>
              <p className="spotlight-quote">
                Read place-linked history on Gesi—then explore Tours &amp; Travel with Gesi-curated
                and verified partner listings for that same heritage landscape.
              </p>
              <p className="spotlight-caption platform-mono">
                Great Zimbabwe · Shona stonework · Trip requests · No online payment
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="section steps-section">
          <div className="landing-container">
            <header className="section-header reveal">
              <p className="platform-label section-eyebrow">Platform flow</p>
              <h2>How it works</h2>
              <p>Story first. Then the journey.</p>
            </header>
            <ol className="steps-row steps-row-connected">
              {steps.map((step) => (
                <li className="step-card step-card-interactive reveal" key={step.num}>
                  <div className="step-card-media">
                    <Image src={step.image} alt={step.alt} width={480} height={300} />
                  </div>
                  <span className="step-num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="join" className="section join-section">
          <div className="landing-container">
            <header className="section-header reveal">
              <p className="platform-label section-eyebrow">Community</p>
              <h2>Who we work with</h2>
              <p>Readers, contributors, and tourism partners—connected across the continent and beyond.</p>
            </header>
            <div className="audience-grid">
              {audiences.map((item) => (
                <article className="audience-card audience-card-interactive reveal" key={item.title}>
                  <div className="audience-card-media">
                    <Image src={item.image} alt={item.alt} width={640} height={360} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <a
                    href={item.href}
                    className={
                      item.href.startsWith("mailto")
                        ? "story-link"
                        : "btn btn-platform-secondary btn-audience"
                    }
                  >
                    {item.cta}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="write" className="section afriarchive-panel">
          <div className="landing-container afriarchive-split reveal">
            <div className="afriarchive-media">
              <Image
                src={siteImages.archive}
                alt="Reading and research for African history"
                width={900}
                height={1100}
                className="afriarchive-photo"
              />
            </div>
            <div className="afriarchive-inner">
              <div className="afriarchive-brand">
                <span className="brand-mark archive-mark" aria-hidden>
                  G
                </span>
                <div>
                  <h2>Gesi Stories</h2>
                  <p className="afriarchive-tag platform-label">Contributor archive</p>
                </div>
              </div>
              <p className="afriarchive-lead">
                The histories behind every route—written with a byline, tied to a real place.
                Publish yours and reach readers before they travel.
              </p>
              <a href={landingLinks.contribute} className="btn btn-platform-primary btn-archive">
                Contribute on Gesi
              </a>
            </div>
          </div>
        </section>

        <section id="partners" className="section partners-section">
          <div className="landing-container partners-band reveal">
            <div className="partners-band-media">
              <Image
                src={siteImages.journey}
                alt="Travelers on a journey to a heritage destination"
                width={900}
                height={600}
              />
            </div>
            <div className="partners-cta">
              <header className="section-header section-header-left">
                <p className="platform-label section-eyebrow">On the ground</p>
                <h2>Verified tourism partners</h2>
                <p>
                  Apply to become a Gesi tourism partner, create draft tours for Admin review, and
                  claim curated listings that genuinely represent your organization.
                </p>
              </header>
              <a href={landingLinks.partner} className="btn btn-platform-primary">
                Partner workspace
              </a>
            </div>
          </div>
        </section>

        <section id="start" className="section neo-cta">
          <div className="landing-container cta-box cta-box-featured reveal">
            <p className="platform-label section-eyebrow">Start here</p>
            <h2>Get started</h2>
            <p>
              Enter Gesi for stories and tours—or leave your details and we&apos;ll follow up.
            </p>
            <p className="hero-actions">
              <a href={landingLinks.explore} className="btn btn-platform-primary">
                Enter Gesi
              </a>
              <a href={landingLinks.visit} className="btn btn-platform-secondary">
                Tours &amp; Travel
              </a>
            </p>
            <WaitlistForm />
            <p className="cta-form-note platform-mono">
              Interest form — we&apos;ll follow up when outreach is active. Trip requests never charge
              online.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="landing-container footer-shell">
          <div className="footer-top">
            <a href="#top" className="brand footer-brand">
              <span className="brand-mark" aria-hidden>
                G
              </span>
              <span>Gesi</span>
            </a>
            <p>Gesi — Truth in heritage. Stories, Tours &amp; Travel, verified partners.</p>
          </div>

          <div className="footer-links-wrap">
            <div className="footer-col">
              <h4>Platform</h4>
              <a href={landingLinks.explore}>Explore Gesi</a>
              <a href={landingLinks.stories}>Stories</a>
              <a href={landingLinks.visit}>Tours &amp; Travel</a>
              <a href={landingLinks.manifesto}>Manifesto</a>
            </div>
            <div className="footer-col">
              <h4>Work with us</h4>
              <a href={landingLinks.contribute}>Contribute</a>
              <a href={landingLinks.partner}>Tourism partners</a>
              <a href={landingLinks.signup}>Create account</a>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <a href={landingLinks.welcome}>About Gesi</a>
              <a href={landingLinks.map}>Map</a>
              <a href={landingLinks.login}>Sign in</a>
              <a href="#how">How it works</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Gesi</p>
          </div>
        </div>
      </footer>
      <MobileCtaBar />
    </RevealInit>
  );
}
