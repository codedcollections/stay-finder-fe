import type { Booking, BookingWithProperty, NewBooking, BookingStatus, BookingRequest } from "@/types/booking";

export type CreateBookingState = {
    error?: string;
    booking?: Booking;
};

export async function getMyBookings(): Promise<BookingWithProperty[]> {
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

export async function getMyBookingRequests(): Promise<BookingRequest[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/requests`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`Could not load booking requests (${response.status})`);
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
    propertyId: string,
    status: BookingStatus,
): Promise<CreateBookingState> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${propertyId}/${bookingId}`,
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

export async function deleteBooking(
    propertyId: string,
    bookingId: string,
): Promise<CreateBookingState> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/properties/${propertyId}/${bookingId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );

    if (response.status === 401) {
        return { error: "You need to be signed in to delete a booking." };
    }

    if (!response.ok) {
        return { error: "Could not delete the booking." };
    }

    return {}
}