import PropertyCard from "./PropertyCard";
import { getProperties, PropertiesFilter } from "@/utils/propertyService";
import PropertyFilter from "./PropertyFilter";
import T from "./typography";
import type { Property } from "@/types/property";

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyList({
  searchParams,
}: PropertyListProps) {
  const params = await searchParams;

  const city = params.city?.toString() || "";

  const maxPrice = params.max_price
    ? Number(params.max_price)
    : undefined;

  const maxGuests = params.max_guests
    ? Number(params.max_guests)
    : undefined;

  const sortBy = params.sort_by?.toString();
  const sortOrder = params.sort_order?.toString();

  const propertiesFilter: PropertiesFilter = {
    city,
    max_price: maxPrice,
    max_guests: maxGuests,
    sort_by:
      sortBy === "price_per_night" ? "price_per_night" : undefined,
    sort_order:
      sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
    };

  let properties: Property[] = [];
  let loadError: string | null = null;

  try {
    properties = await getProperties(propertiesFilter);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load properties.";
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <T.Header size="lg">Places to stay</T.Header>
        <PropertyFilter filter={propertiesFilter} />
      </div>
        {loadError ? (
          <p role="alert">{loadError}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {properties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>
        )}
    </div>
  );
}
