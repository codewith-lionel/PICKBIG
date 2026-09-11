import { FormEvent, useEffect, useState } from "react";
import { api } from "../services/api";

export function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    api.get("/resume/profile").then((response) => setProfile(response.data));
  }, []);

  async function handleUpload(event: FormEvent) {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    setStatus("Uploading and analyzing resume...");

    await api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const response = await api.get("/resume/profile");
    setProfile(response.data);
    setStatus("Resume profile updated.");
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Resume</h2>
      <form onSubmit={handleUpload} className="rounded-xl border bg-white p-4">
        <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <button className="ml-3 rounded bg-brand-600 px-3 py-2 text-sm text-white" type="submit">
          Upload Resume
        </button>
        {status ? <p className="mt-2 text-sm text-slate-600">{status}</p> : null}
      </form>
      <pre className="overflow-auto rounded-xl border bg-white p-4 text-xs">{JSON.stringify(profile, null, 2)}</pre>
    </section>
  );
}
