import type { Property, PropertyKind } from "@/types/property";

export type PropertiesFilter = {
  city?: string;
};

export type CreatePropertyState = {
  error?: string;
  propertyId?: string;
};

const kinds: PropertyKind[] = ["apartment", "villa"];

function isPropertyKind(value: string): value is PropertyKind {
  return kinds.includes(value as PropertyKind);
}

type PropertiesResponse = {
  data: Property[];
  count: number;
  offset: number;
  limit: number;
};

export async function getProperties({
  city,
}: PropertiesFilter = {}): Promise<Property[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`);
  if (city) {
    url.searchParams.append("city", city);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load properties (${response.status})`);
  }

  const result: PropertiesResponse = await response.json();
  return result.data;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/${id}`,
    );
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const property: Property = await response.json();
    return property;
  } catch {
    return null;
  }
}

export async function createProperty(
  formData: FormData,
): Promise<CreatePropertyState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const maxGuests = Number(formData.get("max_guests"));
  const pricePerNight = Number(formData.get("price_per_night"));

  if (!isPropertyKind(kind)) {
    return { error: "Choose apartment or villa." };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        city,
        country,
        image_url: imageUrl || null,
        kind,
        max_guests: maxGuests,
        price_per_night: pricePerNight,
      }),
    },
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to list a stay." };
  }

  if (!response.ok) {
    return {
      error: "Could not create the stay. Check the fields and try again.",
    };
  }

  const property: Property = await response.json();
  return { propertyId: property.property_id };
}
