import { redirect } from "next/navigation";
import { getSession } from "@/modules/auth/session";
import { AdminShell } from "@/components/admin/Shell";
export const instant = false;
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return <AdminShell>{children}</AdminShell>;
}