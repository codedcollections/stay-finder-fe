import type { Property } from "@/types/property";

export type PropertiesFilter = {
    city?: string;
}

export async function getProperties({
    city
}: PropertiesFilter = {}): Promise<Property[]> {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`)
    if(city) {
        url.searchParams.append("city", city)
    }
  try {
    const response = await fetch(url);
    const properties: Property[] = await response.json();
    return properties;
  } catch (e) {
    return []
  }
}
