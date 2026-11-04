"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import BookingCard from "@/components/BookingCard"
import { getMyBookings } from "@/utils/bookingService"

import type { BookingWithProperty } from "@/types/booking"

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load bookings."
        )
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="mx-auto max-w-4xl p-6">

      <Link href="/auth/me" className="text-green-700">
        ← Back to My account
      </Link>

      <h1 className="text-3xl font-bold my-6">
        My bookings
      </h1>

      {loading && <p>Loading bookings…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>You don't have any bookings yet.</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking.booking_id}
              booking={booking}
              index={index}
            />
          ))}
        </div>
      )}

    </main>
  )
}