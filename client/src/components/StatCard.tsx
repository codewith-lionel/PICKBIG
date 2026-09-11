interface Props {
  label: string;
  value: number | string;
}

export function StatCard({ label, value }: Props) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  );
}
