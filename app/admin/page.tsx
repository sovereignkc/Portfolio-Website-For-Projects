import Link from "next/link";
import { AdminDashboard } from "../../components/admin/admin-dashboard";
import { getDashboardContent } from "../../lib/content-store";

export default async function AdminPage() {
  const content = await getDashboardContent();
  return (
    <main className="min-h-screen bg-bg px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-white/35">Private dashboard</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Portfolio editor</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            View site
          </Link>
        </div>
        <AdminDashboard initialContent={content} />
      </div>
    </main>
  );
}
