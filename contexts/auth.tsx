"use client";

import { login } from "@/utils/authService";
import { createContext, useState, useEffect, useContext } from "react";
import type { PropsWithChildren } from "react";

type AuthContextState = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void | string>
};

const defaultState: AuthContextState = {
  user: null,
  login: () => Promise.resolve()
};

const AuthContext = createContext<AuthContextState>(defaultState);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<typeof defaultState.user>(null);

  const _login: typeof defaultState.login = async (email, password) => {
    try {
        const authenticated = await login(email, password)
        if(!authenticated) {
            throw "Invalid credentials"
        }

        return

    } catch (e) {
        console.warn("error in logging in",  e)
        return "invalid Credentials"
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login: _login
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
    return useContext(AuthContext)
}

export {
    AuthProvider,
    useAuth
}