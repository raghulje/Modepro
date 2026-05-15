import type { ReactNode } from "react";

export default function OriginalBulletList({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
