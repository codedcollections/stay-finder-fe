import type { Booking, NewBooking, BookingStatus } from "@/types/booking";

export type CreateBookingState = {
    error?: string;
    booking?: Booking;
};

export async function getMyBookings(): Promise<Booking[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/mine`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`Could not load bookings (${response.status})`);
    }

    return response.json();
}

export async function createBooking(
    propertyId: string,
    booking: NewBooking,
): Promise<CreateBookingState> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${propertyId}`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(booking),
        },
    );

    if (response.status === 401) {
        return { error: "You must be logged in to make a booking." };
    }

    if (!response.ok) {
        return {
            error: `Could not create the booking (${response.status}). Please check the details and try again.`,
        };
    }

    const createdBooking: Booking = await response.json();
    return { booking: createdBooking };
}

export async function updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
): Promise<CreateBookingState> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/:propertyId/:bookingId`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        },
    );

    if (response.status === 401) {
        return { error: "You must be logged in to update a booking." };
    }

    if (!response.ok) {
        return {
            error: `Could not update the booking (${response.status}). Please try again.`,
        };
    }

    const updatedBooking: Booking = await response.json();

    return { booking: updatedBooking };
}