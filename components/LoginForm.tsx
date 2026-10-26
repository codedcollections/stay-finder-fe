"use client";

import * as React from "react";

type Mode = "login" | "register";

export default function LoginForm({ mode = "login" }: { mode?: Mode }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  //OBS! FormEvent if error
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${mode}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ← cookies följer med in/ut
      body: JSON.stringify({ email, password }),
    });

    // Hantera gärna fel och lyckat svar i UI:t.
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div className="flex flex-col">
        <label className="mb-1">Email</label>
        <input
          type="email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">Lösenord</label>
        <input
          type="password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button className="rounded px-4 py-2 border" type="submit">
        {mode === "login" ? "Logga in" : "Skapa konto"}
      </button>
    </form>
  );
}
