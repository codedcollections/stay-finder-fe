
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { createBooking } from "@/utils/bookingService"
import { useAuth } from "@/contexts/auth"

import type { NewBooking } from "@/types/booking"
import { useState, useEffect } from "react"

type BookingFormProps = {
  propertyId: string
  maxGuests: number
  pricePerNight: number
}

export default function BookingForm({
  propertyId,
  maxGuests,
  pricePerNight,
}: BookingFormProps) {
  const auth = useAuth()
  const router = useRouter()

  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [numberOfNights, setNumberOfNights] = useState(0)
  
  useEffect(() => {
    if (!checkIn || !checkOut) {
        setNumberOfNights(0)
        return
    }

    const start = new Date(`${checkIn}T00:00:00`)
    const end = new Date(`${checkOut}T00:00:00`)

    const difference = end.getTime() - start.getTime()

    const nights = Math.max(
        0,
        Math.round(difference / (1000 * 60 * 60 * 24))
    )

    setNumberOfNights(nights)

    }, [checkIn, checkOut])

    const totalPrice = numberOfNights * pricePerNight

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError(undefined)

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out must be after check-in.")
      return
    }

    if (guests < 1 || guests > maxGuests) {
      setError(`Number of guests must be between 1 and ${maxGuests}.`)
      return
    }

    setPending(true)

    try {
      const booking: NewBooking = {
        check_in: checkIn,
        check_out: checkOut,
        guests,
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim(),
      }

      const response = await createBooking(propertyId, booking)

      if ("error" in response) {
        setError(response.error)
        return
      }

      router.push(`/auth/me/bookings`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <label htmlFor="checkIn">Check-in</label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckIn(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="checkOut">Check-out</label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          min={checkIn || new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckOut(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="guests">Number of guests</label>
        <input
          id="guests"
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="guestName">Full name</label>
        <input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          autoComplete="name"
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="guestEmail">Email</label>
        <input
          id="guestEmail"
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
          autoComplete="email"
          className="border rounded px-3 py-2"
        />
      </div>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

    <div className="rounded-xl border p-4 flex flex-col gap-3">

    <h3 className="font-semibold text-lg">
        Booking summary
    </h3>

    <div className="flex justify-between text-sm">
        <span>Price per night</span>
        <span>{pricePerNight} kr</span>
    </div>

    <div className="flex justify-between text-sm">
        <span>Number of nights</span>
        <span>{numberOfNights}</span>
    </div>

    <div className="border-t pt-3 flex justify-between font-semibold">
        <span>Total price</span>
        <span>{totalPrice} kr</span>
    </div>

    </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Creating booking..." : "Book now"}
      </button>

    </form>
  )
}
