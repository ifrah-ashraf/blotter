"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Login failed");
        return;
      }
      router.push("/write");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blotter-app">
      <div className="blotter-wrap">
        <div className="blotter-masthead">
          <h1>THE BLOTTER</h1>
          <div className="blotter-streak">login</div>
        </div>
        <form onSubmit={submit} className="blotter-panel" data-testid="form-login">
          <div className="mb-4">
            <label htmlFor="username" className="mb-[6px] block text-[9px] uppercase tracking-[1.5px] text-[#6b7268]">
              username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-username"
              autoComplete="username"
              className="w-full border border-[#262b23] bg-black p-[10px] text-[13px] text-[#d8dcd4] outline-none focus:border-[#8a5f00]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="mb-[6px] block text-[9px] uppercase tracking-[1.5px] text-[#6b7268]">
              password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
              autoComplete="current-password"
              className="w-full border border-[#262b23] bg-black p-[10px] text-[13px] text-[#d8dcd4] outline-none focus:border-[#8a5f00]"
            />
          </div>
          {error && (
            <p className="mb-4 text-[11px] text-destructive" data-testid="status-login-error">
              {error}
            </p>
          )}
          <p className="mb-4 text-[11px] text-[#6b7268]" data-testid="note-login-admin-only">
            Note: Only admins can login to write the logs
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-login-submit"
            className="w-full bg-[#ffb000] hover:cursor-pointer px-4 py-3 text-[11.5px] font-bold uppercase tracking-[1.5px] text-black disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "checking" : "log in"}
          </button>
        </form>
      </div>
    </div>
  );
}