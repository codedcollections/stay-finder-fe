"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth"
import T from "./typography"

export default function AuthHeader() {
  const auth = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    const result = await auth.logout()

    if (typeof result === "string") {
      console.error(result)
      return
    }

    router.replace("/")
  }
  return (
    <div>
      {!auth.user && (
        <T.Header>
          <Link href="/auth/login">Log in</Link>
        </T.Header>
      )}

      {auth.user && (
        <div className="group relative">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            Log out
          </button>
          <div className="invisible absolute right-0 pt-1 top-full z-10 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className=" border border-zinc-200 bg-amber-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              {auth.user.email}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
