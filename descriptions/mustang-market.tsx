// =============================================================================
// Extended description for the "mustang-market" card on /work.
//
// Rendered by ProjectModal when the user clicks the mustang-market card. The
// short description on the card itself acts as a TL;DR above this block.
//
// Authoring pattern (use this file as a template for other projects):
//   - Wrap each logical section in <section className="pm-extended-section">
//     with an <h3 className="pm-extended-heading"> at the top.
//   - Body copy goes in <p className="pm-extended-prose"> — line-height + max
//     line-length are tuned in globals.css.
//   - For a single screenshot, use <figure className="pm-screenshot"> with a
//     next/image inside and an optional <figcaption className="pm-screenshot-
//     caption">.
//   - For two-up image rows, wrap two screenshots in <div className="pm-gallery">
//     — it's a 2-col grid on desktop, 1-col on mobile.
//
// Assets live under `public/projects/mustang-market/` so next/image can serve
// them as `/projects/mustang-market/<filename>`. Image examples below are
// commented out until the user populates that folder.
// =============================================================================

// Uncomment once `public/projects/mustang-market/` has the referenced assets.
// import Image from "next/image";

export default function MustangMarketDescription() {
  return (
    <>
      <section className="pm-extended-section">
        <h3 className="pm-extended-heading">Overview</h3>
        <p className="pm-extended-prose">
          Mustang Market is a peer-to-peer marketplace gated to verified .edu addresses.
          The MVP solved a problem I kept running into on campus: nobody trusts a stranger
          on Facebook Marketplace, but everyone trusts the person two doors down in their
          dorm. By gating on a verified university email, the social graph collapses to
          people you might actually know.
        </p>
        <p className="pm-extended-prose">
          Replace this prose with the real writeup — what you built, what the constraints
          were, why the architectural decisions were made the way they were.
        </p>
      </section>

      {/* Screenshot pattern — single image, optionally captioned.
          Uncomment once /public/projects/mustang-market/hero.png exists.

      <figure className="pm-screenshot">
        <Image
          src="/projects/mustang-market/hero.png"
          alt="Mustang Market home feed showing recent listings"
          width={1600}
          height={1000}
        />
        <figcaption className="pm-screenshot-caption mono">
          fig 01 — the home feed.
        </figcaption>
      </figure>
      */}

      <section className="pm-extended-section">
        <h3 className="pm-extended-heading">Stack &amp; architecture</h3>
        <p className="pm-extended-prose">
          Drop in implementation notes here — auth flow, data model, anything that the
          short-description stack chips can&apos;t convey on their own.
        </p>
      </section>

      {/* Two-up gallery pattern — drop two figures inside .pm-gallery for a
          2-col layout on desktop, single-col on mobile.

      <div className="pm-gallery">
        <figure className="pm-screenshot">
          <Image
            src="/projects/mustang-market/listing-detail.png"
            alt="Listing detail view"
            width={1200}
            height={1500}
          />
        </figure>
        <figure className="pm-screenshot">
          <Image
            src="/projects/mustang-market/messages.png"
            alt="In-app messaging thread"
            width={1200}
            height={1500}
          />
        </figure>
      </div>
      */}

      <section className="pm-extended-section">
        <h3 className="pm-extended-heading">What I&apos;d do differently</h3>
        <p className="pm-extended-prose">
          Retrospective notes go here. Honest about what didn&apos;t work; that&apos;s the
          part visitors actually want to read.
        </p>
      </section>
    </>
  );
}
