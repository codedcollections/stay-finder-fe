"use client";

import { useAuth } from "@/contexts/auth";
import T from "./typography";

export default function AuthHeader(){
    const auth = useAuth()

    return (
        <div>
            {!auth.user && <T.Header>Not logged in</T.Header>}
            {auth.user && <T.Header>Logged in {auth.user.email}</T.Header>}
        </div>
    )
}