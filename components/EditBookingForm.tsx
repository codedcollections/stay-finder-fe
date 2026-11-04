"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import type { BookingRequest, NewBooking } from "@/types/booking"
import { updateBooking } from "@/utils/bookingService"
import { createBookingSchema } from "@/validators/bookingValidator"

type EditBookingFormProps = {
  booking: BookingRequest
  maxGuests: number
}

export default function EditBookingForm({
  booking,
  maxGuests,
}: EditBookingFormProps) {
  const router = useRouter()

  const [checkIn, setCheckIn] = useState(booking.check_in)
  const [checkOut, setCheckOut] = useState(booking.check_out)
  const [guests, setGuests] = useState(booking.guests)
  const [guestName, setGuestName] = useState(booking.guest_name)
  const [guestEmail, setGuestEmail] = useState(booking.guest_email)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const validation = createBookingSchema(maxGuests).safeParse({
      check_in: checkIn,
      check_out: checkOut,
      guests,
      guest_name: guestName,
      guest_email: guestEmail,
    })

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ?? "Check the booking details.",
      )
      return
    }

    const changes: NewBooking = validation.data
    setSaving(true)

    try {
      const result = await updateBooking(
        booking.booking_id,
        booking.property_id,
        changes,
      )

      if (result.error) {
        setError(result.error)
        return
      }

      router.push("/auth/me/bookings")
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update the booking.",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Check-in
        <input
          type="date"
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Check-out
        <input
          type="date"
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Guests
        <input
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
          required
          className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Guest name
        <input
          type="text"
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Guest email
        <input
          type="email"
          value={guestEmail}
          onChange={(event) => setGuestEmail(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full mt-2 p-3 bg-black hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
      >
        {saving ? "Saving…" : "Save booking"}
      </button>
    </form>
  )
}
