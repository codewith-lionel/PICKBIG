import { FormEvent, useState } from "react";
import { api } from "../services/api";

export function CompaniesPage() {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    const response = await api.post("/companies/search", { company });
    setResult(response.data);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Find companies hiring</h2>
      <form className="rounded border bg-white p-4" onSubmit={handleSearch}>
        <input value={company} onChange={(event) => setCompany(event.target.value)} className="rounded border px-3 py-2" placeholder="Company name" />
        <button className="ml-2 rounded bg-brand-600 px-3 py-2 text-sm text-white" type="submit">Search</button>
      </form>
      <pre className="overflow-auto rounded border bg-white p-4 text-xs">{JSON.stringify(result, null, 2)}</pre>
    </section>
  );
}
