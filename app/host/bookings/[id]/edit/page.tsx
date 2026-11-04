"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import EditBookingForm from "@/components/EditBookingForm"
import { getMyBookingRequests } from "@/utils/bookingService"
import { getPropertyById } from "@/utils/propertyService"
import type { BookingRequest } from "@/types/booking"

export default function EditBookingPage() {
  const { id } = useParams<{ id: string }>()

  const [booking, setBooking] = useState<BookingRequest | null>(null)
  const [maxGuests, setMaxGuests] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadBookingAndProperty() {
      try {
        const requests = await getMyBookingRequests()
        const foundBooking = requests.find(
          (request) => request.booking_id === id
        )

        if (!foundBooking) {
          if (active) setError("Booking not found.")
          return
        }

        const property = await getPropertyById(foundBooking.property_id)

        if (!property) {
          if (active) setError("Could not load the property's details.")
          return
        }

        if (active) {
          setBooking(foundBooking)
          setMaxGuests(property.max_guests)
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load the booking."
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadBookingAndProperty()

    return () => {
      active = false
    }
  }, [id])

  if (loading) return <p>Loading booking…</p>
  if (error) return <p role="alert">{error}</p>
  if (!booking || maxGuests === null) {
    return <p>Booking or property not found.</p>
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit booking</h1>
      <h2 className="mb-4 text-lg font-semibold">
        {booking.properties.title}
      </h2>
      <EditBookingForm booking={booking} maxGuests={maxGuests} />
    </main>
  )
}