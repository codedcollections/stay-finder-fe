import EditPropertyForm from "@/components/EditPropertyForm";
import { getPropertyById } from "@/utils/propertyService";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: PageProps<"/host/properties/[id]/edit">) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return notFound();
  }

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-10 gap-3">
      <h1>Edit property</h1>
      <EditPropertyForm
        propertyId={id}
        values={{
          title: property.title,
          description: property.description,
          city: property.city,
          country: property.country,
          image_url: property.image_url ?? "",
          kind: property.kind,
          max_guests: property.max_guests,
          price_per_night: property.price_per_night,
        }}
      />
    </main>
  );
}