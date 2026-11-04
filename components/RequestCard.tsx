
"use client"

import { useState,useEffect } from "react"
import type { BookingRequest } from "@/types/booking"
import type { Property } from "@/types/property"
import { updateBookingStatus } from "@/utils/bookingService"

type PropertyWithRequests = Property & {
  bookings: BookingRequest[]
}

type RequestCardProps = {
  property: PropertyWithRequests
  onRequestUpdated: () => Promise<void>
}

export default function RequestCard({
  property,
  onRequestUpdated,
}: RequestCardProps) {
  const [bookings, setBookings] = useState(property.bookings)
  const [error, setError] = useState("")

  useEffect(() => {
  setBookings(property.bookings);
}, [property.bookings]);

  const handleStatusChange = async (
    booking: BookingRequest,
    status: "confirmed" | "cancelled"
  ) => {
    setError("")

    const result = await updateBookingStatus(
      booking.booking_id,
      booking.property_id,
      status
    )

    if (result.error) {
      setError(result.error)
      return
    }

    setBookings((current) =>
  current.map((item) =>
    item.booking_id === booking.booking_id
      ? { ...item, status }
      : item
    )
    )
    await onRequestUpdated()
  }

  return (
    <div className="border rounded-xl p-5 shadow-sm">

      {/* Property information */}
      <div className="mb-6">
        {property.image_url && (
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
        )}

        <h2 className="text-xl font-semibold">
          {property.title}
        </h2>

        <p className="text-sm text-gray-500">
          {property.city}, {property.country}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-4">
        Booking requests ({bookings.length})
      </h3>

      {bookings.length === 0 && (
        <p className="text-gray-500">
          No booking requests for this property yet.
        </p>
      )}

      {/* Individual bookings */}
      <div className="flex flex-col gap-5">

        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="border rounded-lg p-4 bg-gray-50"
          >

            <p className="mb-4">
              <span className="text-sm text-gray-500">
                Status:{" "}
              </span>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : booking.status === "cancelled"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium">
                  {new Date(booking.check_in).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium">
                  {new Date(booking.check_out).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{booking.guests}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Guest name</p>
                <p className="font-medium">{booking.guest_name}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium break-all">
                  {booking.guest_email}
                </p>
              </div>

            </div>

            {/* Confirm / Cancel */}
            <div className="grid grid-cols-2 gap-3 mt-5">

              <button
                onClick={() =>
                  handleStatusChange(booking, "confirmed")
                }
                disabled={booking.status !== "pending"}
                className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  handleStatusChange(booking, "cancelled")
                }
                disabled={booking.status !== "pending"}
                className="p-3 bg-black hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                Cancel
              </button>

            </div>

          </div>
        ))}

      </div>

      {error && (
        <p role="alert" className="text-red-500 mt-4">
          {error}
        </p>
      )}

    </div>
  )
}
