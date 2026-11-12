import Link from "next/link";

type Props = {
  title: string;
  description: string;
  cta?: { href: string; label: string };
};

export function EmptyState({ title, description, cta }: Props) {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined">inventory_2</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {cta && (
        <Link href={cta.href} className="btn-primary">
          {cta.label}
        </Link>
      )}
    </div>
  );
}