import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "home", to: "/" },
  { label: "people", to: "/people" },
  { label: "publications", to: "/research" },
];

interface NavBarProps {
  variant?: "dark" | "light";
}

const NavBar = ({ variant = "dark" }: NavBarProps) => {
  const { pathname } = useLocation();

  const textClass =
    variant === "dark"
      ? "text-foreground/80 hover:text-foreground"
      : "text-foreground/60 hover:text-foreground";

  const activeClass =
    variant === "dark"
      ? "text-foreground underline underline-offset-4"
      : "text-foreground underline underline-offset-4";

  return (
    <nav className="flex items-center gap-8 font-mono-display text-base tracking-wide">
      {links.map((link) => {
        const isActive =
          link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`transition-colors ${isActive ? activeClass : textClass}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
