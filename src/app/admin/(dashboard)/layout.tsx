import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Block customer accounts from accessing admin panel
  const role = (session.user as any).role;
  if (role === "CUSTOMER") {
    redirect("/dashboard");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar userName={session.user.name || "Admin"} />
      <main
        style={{
          flex: 1,
          marginLeft: 260,
          padding: "32px 40px",
          background: "var(--bg-primary)",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
