"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import RequestCard from "@/components/RequestCard"

import {
  getMyBookingRequests,
} from "@/utils/bookingService"

import {
  getMyProperties,
} from "@/utils/propertyService"

import type { BookingRequest } from "@/types/booking"
import type { Property } from "@/types/property"

type PropertyWithRequests = Property & {
  bookings: BookingRequest[]
}

export default function MyRequestsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [requests, setRequests] = useState<BookingRequest[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myProperties, myRequests] = await Promise.all([
          getMyProperties(),
          getMyBookingRequests(),
        ])

        setProperties(myProperties)
        setRequests(myRequests)

      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load booking requests."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshRequests = async () => {
    try {
      const updatedRequests = await getMyBookingRequests()
      setRequests(updatedRequests)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not refresh booking requests."
      )
    }
  }

  const propertiesWithRequests: PropertyWithRequests[] =
    properties.map((property) => ({
      ...property,
      bookings: requests.filter(
        (request) =>
          request.property_id === property.property_id
      ),
    }))

  return (
    <main className="mx-auto max-w-4xl p-6">

      <Link href="/auth/me" className="text-green-700">
        ← Back to My account
      </Link>

      <h1 className="text-3xl font-bold my-6">
        Booking requests
      </h1>

      {loading && <p>Loading requests…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>You don't have any booking requests yet.</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-8">

          {propertiesWithRequests.map((property) => (
            <RequestCard
              key={property.property_id}
              property={property}
              onRequestUpdated={refreshRequests}
            />
          ))}

        </div>
      )}

    </main>
  )
}