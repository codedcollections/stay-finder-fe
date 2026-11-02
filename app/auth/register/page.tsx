import Authform from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto">
        <h1>Registrera konto</h1>
        <Authform mode="register" />
        <p>Redan registrerad? <Link href="/auth/login/"  className="text-blue-600 hover:text-purple-600 transition-colors duration-200 underline">Logga in</Link></p>
    </div>
  );
}
