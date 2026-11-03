
"use client"

import {
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

import { useEffect, useState } from "react"
import BookingCard from "@/components/BookingCard"
import PropertyCard from "@/components/PropertyCard"
import { getMyBookings } from "@/utils/bookingService"
import { getMyProperties } from "@/utils/propertyService"
import type { Booking } from "@/types/booking"
import type { Property } from "@/types/property"
import Link from "next/link"

export default function MyPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [propertiesLoading, setPropertiesLoading] = useState(true)
  const [propertiesError, setPropertiesError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<"bookings" | "properties">("bookings")

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load bookings.")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getMyProperties()
      .then(setProperties)
      .catch((err: unknown) => {
        setPropertiesError(
          err instanceof Error ? err.message : "Could not load properties.",
        )
      })
      .finally(() => setPropertiesLoading(false))
  }, [])

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">
        My account
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors hover:bg-gray-600  ${
            activeTab === "bookings"
              ? "bg-green-600 text-white"
              : "bg-black text-white"
          }`}
        >
          My bookings
        </button>

        <button
          onClick={() => setActiveTab("properties")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors hover:bg-gray-600 ${
            activeTab === "properties"
              ? "bg-green-600 text-white"
              : "bg-black text-white"
          }`}
        >
          My properties
        </button>
      </div>

      {/* My bookings */}
      {activeTab === "bookings" && (
        <>
          {loading && <p>Loading bookings…</p>}

          {error && <p role="alert">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <p>You don’t have any bookings yet.</p>
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
        </>
      )}

      {activeTab === "properties" && (
        <>
          {propertiesLoading && <p>Loading properties…</p>}
          {propertiesError && <p role="alert">{propertiesError}</p>}

          {!propertiesLoading && !propertiesError && properties.length === 0 && (
            <p>You haven't added any properties yet.</p>
          )}

          {!propertiesLoading && !propertiesError && properties.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {properties.map((property) => (
                <div key={property.property_id}>
                <PropertyCard
                  property={property}
                />
                <Link className="flex align-middle gap-1 mt-2" href={`/host/properties/${property.property_id}/edit`}>
                  <PencilSquareIcon className="h-6 w-6" />Edit Property
                </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
