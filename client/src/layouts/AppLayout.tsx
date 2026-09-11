import { Link, Outlet } from "react-router-dom";

const nav = [
  ["/dashboard", "Dashboard"],
  ["/resume", "Resume"],
  ["/jobs", "Jobs"],
  ["/companies", "Companies"],
  ["/applications", "Applications"],
  ["/settings", "Settings"]
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="font-bold text-brand-600">PICKBIG AI Job Assistant</h1>
          <nav className="flex gap-3 text-sm">
            {nav.map(([href, label]) => (
              <Link key={href} className="rounded px-2 py-1 hover:bg-slate-100" to={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
