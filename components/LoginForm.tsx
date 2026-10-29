"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"

type Mode = "login" | "register"

export default function LoginForm({ mode = "login" }: { mode?: Mode }) {
  const auth = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string>()
  const [pending, setPending] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  //OBS! FormEvent if error
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(undefined)
    setPending(true)
    try {
      const response = await auth.login(email.trim(), password)
      if (typeof response === "string") {
        setError(response)
        return
      }
      router.push("/")
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 items-end justify-center px-6 py-10 gap-3"
    >
      <div className="flex flex-col ">
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

      <button type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
