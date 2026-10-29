"use client"

import { login, logout, getMe } from "@/utils/authService"
import { createContext, useState, useEffect, useContext } from "react"
import type { PropsWithChildren } from "react"

type AuthContextState = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void | string>
  logout: () => Promise<void | string>
}

const defaultState: AuthContextState = {
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
}

const AuthContext = createContext<AuthContextState>(defaultState)

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<typeof defaultState.user>(null)

  useEffect(() => {
    let cancelled = false

    const loadCurrentUser = async () => {
      try {
        const currentUser = await getMe()

        if (!cancelled) {
          setUser(currentUser)
        }
      } catch (error) {
        console.warn("Error loading current user", error)
      }
    }

    void loadCurrentUser()

    return () => {
      cancelled = true
    }
  }, [])

  const _login: typeof defaultState.login = async (email, password) => {
    try {
      const authenticated = await login(email, password)
      if (!authenticated) {
        throw new Error("Invalid credentials")
      }

      const currentUser = await getMe()
      if (!currentUser) {
        throw new Error(
          "Login succeeded, but the current user could not be loaded",
        )
      }

      setUser(currentUser)
      return
    } catch (e) {
      console.warn("error in logging in", e)
      return "invalid Credentials"
    }
  }

  const _logout: typeof defaultState.logout = async () => {
    try {
      const loggedOut = await logout()
      if (!loggedOut) {
        throw "Failed to log out"
      }
      setUser(null)
      return
    } catch (e) {
      console.warn("error in logging out", e)
      return "Failed to log out"
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login: _login,
        logout: _logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
