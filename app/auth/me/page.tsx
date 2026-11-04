import Link from "next/link"

export default function MyAccountPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">

      <h1 className="text-3xl font-bold text-center mb-8">
        My account
      </h1>

      <nav aria-label="My account">
        <ul className="flex gap-4">

          <li>
            <Link
              href="/auth/me/bookings"
              className="block p-5 border rounded-xl hover:bg-gray-50"
            >
              My bookings
            </Link>
          </li>

          <li>
            <Link
              href="/auth/me/properties"
              className="block p-5 border rounded-xl hover:bg-gray-50"
            >
              My properties
            </Link>
          </li>

          <li>
            <Link
              href="/auth/me/requests"
              className="block p-5 border rounded-xl hover:bg-gray-50"
            >
              Booking requests
            </Link>
          </li>

        </ul>
      </nav>

    </main>
  )
}