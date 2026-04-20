import { people } from "@/data/people";
import NavBar from "@/components/NavBar";

const currentMembers = people.filter((p) => p.category === "current");
const alumni = people.filter((p) => p.category === "alumni");

// Extract a sortable year from a person's period string.
// Uses the last 4-digit year found (e.g., "2023 – 2024" -> 2024, "2024" -> 2024).
function getAlumniYear(period: string): number {
  const matches = period.match(/\d{4}/g);
  if (!matches || matches.length === 0) return 0;
  return parseInt(matches[matches.length - 1], 10);
}

// Rank by destination: phd first, then ms, then industry/other, then no destination.
function destinationRank(dest?: string): number {
  if (!dest) return 3;
  const d = dest.toLowerCase();
  if (d.includes("phd")) return 0;
  if (d.includes("ms")) return 1;
  return 2; // industry / other
}

const alumniByYear = alumni.reduce<Record<number, typeof alumni>>((acc, person) => {
  const year = getAlumniYear(person.period);
  if (!acc[year]) acc[year] = [];
  acc[year].push(person);
  return acc;
}, {});

// Sort each year's group by destination rank.
Object.keys(alumniByYear).forEach((y) => {
  alumniByYear[parseInt(y, 10)].sort(
    (a, b) => destinationRank(a.destination) - destinationRank(b.destination)
  );
});

const alumniYears = Object.keys(alumniByYear)
  .map((y) => parseInt(y, 10))
  .sort((a, b) => b - a);

const People = () => {
  return (
    <div className="light-research min-h-screen bg-background text-foreground">
      {/* header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] px-8 py-5 flex items-center justify-end">
          <NavBar variant="light" />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-8 pb-20">
        {/* current members */}
        <section className="pt-8 pb-16">
          <h2 className="mb-10 text-sm font-medium tracking-widest text-muted-foreground">
            current members
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {currentMembers.map((person) => (
              <PersonCard key={person.name} person={person} />
            ))}
          </div>
        </section>

        {/* alumni grouped by year */}
        <section className="pb-16">
          <h2 className="mb-10 text-sm font-medium tracking-widest text-muted-foreground">
            alumni
          </h2>
          <div className="space-y-12">
            {alumniYears.map((year) => (
              <div key={year}>
                <h3 className="mb-6 text-xs font-medium tracking-widest text-muted-foreground/70">
                  {year}
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {alumniByYear[year].map((person) => (
                    <PersonCard key={person.name} person={person} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

function PersonCard({ person }: { person: (typeof people)[number] }) {
  return (
    <a
      href={person.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center text-center"
    >
      {/* circular avatar */}
      <div className="mb-4 h-44 w-44 overflow-hidden rounded-full bg-muted">
        <img
          src={person.image}
          alt={person.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
        />
      </div>

      {/* name */}
      <h3 className="text-sm font-semibold text-foreground group-hover:underline underline-offset-2">
        {person.name}
      </h3>

      {/* role */}
      <p className="mt-0.5 text-xs text-muted-foreground">{person.role}</p>

      {/* period */}
      <p className="text-xs text-muted-foreground/60">{person.period}</p>

      {/* destination for alumni */}
      {person.destination && (
        <p className="mt-0.5 text-xs text-muted-foreground/80">
          → {person.destination}
        </p>
      )}
    </a>
  );
}

export default People;
