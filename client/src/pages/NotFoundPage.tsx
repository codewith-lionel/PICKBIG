import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <Link className="text-brand-600" to="/dashboard">Go to dashboard</Link>
    </section>
  );
}
