import { getPropertyById } from "@/utils/propertyService"
import { notFound } from "next/navigation"
import BookingForm from "@/components/BookingForm"
import Image from "next/image"

export default async function BookingPage({
  params,
}: PageProps<"/bookings/[id]">) {

  const { id } = await params

  const property = await getPropertyById(id)

  if (!property) {
    return notFound()
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">

      <h1 className="text-2xl font-bold">
        Boka {property.title}
      </h1>
      {property.image_url ? (
        <Image
          src={property.image_url}
          width={600}
          height={300}
          alt={`${property.title}`}
          loading="eager"
        />
      ) : (
        <div
          className="flex h-50 w-74 items-center justify-center bg-zinc-100 text-sm text-zinc-500"
          aria-label="No property image available"
        >
          No image available
        </div>
      )}

      <p>
        {property.city}, {property.country}
      </p>

      <BookingForm
        propertyId={property.property_id}
        maxGuests={property.max_guests}
        pricePerNight={property.price_per_night}
      />

    </main>
  )
}