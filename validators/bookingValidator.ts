import { z } from "zod";

export const createBookingSchema = (maxGuests: number) =>
    z
        .object({
            check_in: z.string().min(1, "Choose a check-in date."),

            check_out: z.string().min(1, "Choose a check-out date."),

            guests: z
                .number()
                .int("Guests must be a whole number.")
                .min(1, "Guests must be at least 1.")
                .max(
                    maxGuests,
                    `Guests cannot exceed ${maxGuests}.`,
                ),

            guest_name: z
                .string()
                .trim()
                .min(2, "Guest name must be at least 2 characters."),

            guest_email: z
                .string()
                .trim()
                .email("Enter a valid email address."),
        })
        .refine(
            (values) => values.check_out > values.check_in,
            {
                message: "Check-out must be after check-in.",
                path: ["check_out"],
            },
        );

export type BookingFormValues = z.infer<
    ReturnType<typeof createBookingSchema>
>;