import { useState, useMemo } from "react";
import { publications, type Publication } from "@/data/publications";
import { Search, ExternalLink } from "lucide-react";
import NavBar from "@/components/NavBar";

const Research = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let result = publications;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q) ||
          String(p.year).includes(q)
      );
    }
    return result;
  }, [query]);

  // group by year, descending
  const grouped = useMemo(() => {
    const map = new Map<number, Publication[]>();
    filtered.forEach((p) => {
      if (!map.has(p.year)) map.set(p.year, []);
      map.get(p.year)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  return (
    <div className="light-research min-h-screen bg-background text-foreground">
      {/* header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1100px] px-8 py-5 flex items-center justify-end">
          <NavBar variant="light" />
        </div>
      </header>

      {/* search */}
      <div className="mx-auto max-w-[1100px] px-8 pt-2 pb-10">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search publications..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
      </div>

      {/* publication list grouped by year */}
      <main className="mx-auto max-w-[1100px] px-8 pb-20">
        {grouped.map(([year, pubs]) => (
          <section key={year} className="mb-14">
            <h2 className="mb-6 font-mono-display text-2xl font-semibold text-foreground">
              {year}
            </h2>
            <ul className="space-y-8">
              {pubs.map((pub) => (
                <li
                  key={pub.id}
                  className="group grid grid-cols-[140px_1fr] gap-6 items-start"
                >
                  {/* thumbnail */}
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-muted">
                    {pub.video ? (
                      <video
                        src={pub.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                      />
                    ) : pub.image ? (
                      <img
                        src={pub.image}
                        alt={pub.title}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>

                  {/* details */}
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold leading-snug text-foreground">
                      {pub.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {pub.authors}
                    </p>
                    <p className="mt-1.5 text-xs uppercase tracking-wide text-foreground/70">
                      {pub.venue}
                      {pub.award && (
                        <span className="ml-2 italic underline underline-offset-2">
                          {pub.award}
                        </span>
                      )}
                    </p>

                    {pub.links.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {pub.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                          >
                            {link.label}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            no publications match your search.
          </p>
        )}
      </main>
    </div>
  );
};

export default Research;
