import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed");
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Register</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded border px-3 py-2" placeholder="Name" required />
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded border px-3 py-2" type="email" placeholder="Email" required />
        <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded border px-3 py-2" type="password" placeholder="Password" required minLength={8} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-brand-600 px-3 py-2 font-medium text-white">Create account</button>
      </form>
      <p className="mt-3 text-sm">
        Already have an account? <Link className="text-brand-600" to="/login">Login</Link>
      </p>
    </div>
  );
}
