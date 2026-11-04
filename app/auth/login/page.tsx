import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto">
      <h1>Logga in</h1>
      <AuthForm />
      <Link href={'/auth/register'} className="text-blue-600 hover:text-purple-600 transition-colors duration-200 underline">Registrera konto</Link>
    </div>
  );
}
