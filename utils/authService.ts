export async function login(email: string, password: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    return true;
  }
  return false;
}
