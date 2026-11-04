
import { useState, useEffect } from "react"
import type { BookingWithProperty } from "@/types/booking"
import { deleteBooking } from "@/utils/bookingService"

type BookingCardProps = {
  booking: BookingWithProperty
  index: number
}


export default function BookingCard({
  booking,
  index,
}: BookingCardProps) {

const [deleted, setDeleted] = useState(false)

  const handleClick = async () => {
    try {
      await deleteBooking(booking.property_id, booking.booking_id)
      setDeleted(true)
    } catch (error) {
      console.error("Failed to delete booking:", error)
    }
  }

  if (deleted) return null


  
  return (
    <div className="border rounded-xl p-5 shadow-sm">
      <div className="mb-5">
        {booking.properties?.image_url && (
          <img
            src={booking.properties.image_url}
            alt={booking.properties.title}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
        )}

        <h2 className="text-xl font-semibold">
          {booking.properties?.title ?? "Property unavailable"}
        </h2>

        <p className="text-sm text-gray-500">
          {booking.properties?.city}, {booking.properties?.country}
        </p>
      </div>
    
      <p className="mb-4">
        <span className="text-sm text-gray-500">Status: </span>
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
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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

        <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{booking.guest_email}</p>
        </div>
    </div>

      <button
        onClick={handleClick}
        disabled={booking.status === "cancelled"}
        className="w-full mt-5 p-3 bg-black hover:bg-red-500
    disabled:bg-gray-300 disabled:hover:bg-gray-300
    disabled:cursor-not-allowed text-white rounded-md transition-colors"
      >
        Cancel booking
      </button>
    </div>
  )
}
