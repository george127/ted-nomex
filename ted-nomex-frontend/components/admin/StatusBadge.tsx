import type { ReactNode } from "react";

type Variant =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded"
  | "new"
  | "contacted"
  | "converted"
  | "closed"
  | "planning"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "handled"
  | "unhandled"
  | "published"
  | "draft";

const labels: Record<Variant, string> = {
  pending: "Pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  refunded: "Refunded",
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
  planning: "Planning",
  "in-progress": "In progress",
  "on-hold": "On hold",
  completed: "Completed",
  handled: "Handled",
  unhandled: "Unhandled",
  published: "Published",
  draft: "Draft",
};

export function StatusBadge({ variant }: { variant: Variant }): ReactNode {
  return <span className={`status-badge status-${variant}`}>{labels[variant]}</span>;
}

// Helper mappers
export function orderVariant(s: string): Variant {
  const k = s.toLowerCase() as Variant;
  return ["pending", "paid", "fulfilled", "cancelled", "refunded"].includes(k)
    ? k
    : "pending";
}
export function quoteVariant(s: string): Variant {
  const k = s.toLowerCase() as Variant;
  return ["new", "contacted", "converted", "closed"].includes(k) ? k : "new";
}
export function projectVariant(s: string): Variant {
  const k = s.toLowerCase().replace("_", "-") as Variant;
  return ["planning", "in-progress", "on-hold", "completed"].includes(k) ? k : "planning";
}