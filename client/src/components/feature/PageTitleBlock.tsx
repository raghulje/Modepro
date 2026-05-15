interface PageTitleBlockProps {
  title: string;
  highlight?: string;
  underlineClass?: string;
  className?: string;
  variant?: "hero" | "section" | "bold";
}

export default function PageTitleBlock({
  title,
  highlight,
  underlineClass = "underline-w-welcome",
  className = "",
  variant = "hero",
}: PageTitleBlockProps) {
  const titleClass =
    variant === "bold"
      ? "page-hero-title-bold"
      : variant === "section"
        ? "section-title-center"
        : "page-hero-title";

  return (
    <div className={className}>
      <h1 className={titleClass}>
        {title}
        {highlight && (
          <>
            {" "}
            <span className="section-title-accent">{highlight}</span>
          </>
        )}
      </h1>
      <span
        className={`section-title-underline ${underlineClass}`}
        aria-hidden="true"
      />
    </div>
  );
}
