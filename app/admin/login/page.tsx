import Link from "next/link";
import { LoginForm } from "../../../components/admin/login-form";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const nextPath = params?.next?.startsWith("/") ? (params.next as `/${string}`) : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 text-white">
      <div className="glass w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-glow">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.34em] text-white/35">Private access</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin login</h1>
          <p className="mt-2 text-sm leading-6 text-white/50">
            Sign in to edit projects and update the dashboard content.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />

        <div className="mt-5 text-sm text-white/40">
          Back to <Link href="/" className="text-white/80 underline decoration-white/30">portfolio</Link>.
        </div>
      </div>
    </main>
  );
}
