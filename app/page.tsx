export default function Home() {
  const sections = [
    "Home",
    "About",
    "Projects",
    "Skills",
    "Resume",
    "Contact",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-foreground/15 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-5xl flex-wrap gap-4 px-6 py-4">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section.toLowerCase()}`}
              className="text-sm font-medium transition-opacity hover:opacity-70"
            >
              {section}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        {sections.map((section) => (
          <section
            key={section}
            id={section.toLowerCase()}
            className="scroll-mt-24 border-b border-foreground/15 py-14"
          >
            <h2 className="mb-3 text-3xl font-semibold">{section}</h2>
            <p className="max-w-2xl text-base leading-7 text-foreground/75">
              {section === "Home"
                ? "Welcome to my portfolio. This is the starting section where I can introduce myself and highlight what I build."
                : `Placeholder content for the ${section} section. I will add details here next.`}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
}
