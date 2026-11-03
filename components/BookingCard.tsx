
import type { Booking } from "@/types/booking"

type BookingCardProps = {
  booking: Booking
  index: number
}

export default function BookingCard({
  booking,
  index,
}: BookingCardProps) {
  return (
    <div className="border rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        Booking #{index + 1}
      </h2>

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

        <button className="w-full mt-5 p-3 bg-black hover:bg-red-500 text-white rounded-md transition-colors">
        Cancel booking
        </button>

    </div>
  )
}
