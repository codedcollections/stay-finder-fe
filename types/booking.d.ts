import type { Database } from "./database.types.js";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

export type NewBooking = Omit<
  BookingInsert,
  "user_id" | "booking_id" | "property_id" | "created_at" | "status"
>;

export type BookingValidKey = keyof Booking;