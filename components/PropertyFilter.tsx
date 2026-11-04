
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertiesFilter } from "@/utils/propertyService";

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

function Searchbar({ search, setSearch }: SearchBarProps) {
  return (
    <input
      type="search"
      value={search}
      placeholder="City"
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300"
    />
  );
}

type PropertyFilterProps = {
  filter: PropertiesFilter;
};

export default function PropertyFilter({
  filter,
}: PropertyFilterProps) {
  const router = useRouter();

  const [filterError, setFilterError] = useState<string | null>(null);
  const [search, setSearch] = useState(filter.city || "");
  const [maxPrice, setMaxPrice] = useState(
    filter.max_price?.toString() || ""
  );
  const [guests, setGuests] = useState(
    filter.max_guests?.toString() || ""
  );

  const onFiltering = () => {
  setFilterError(null);

  const price = maxPrice === "" ? undefined : Number(maxPrice);
  const guestCount = guests === "" ? undefined : Number(guests);

  if (
    price !== undefined &&
    (!Number.isInteger(price) || price < 0)
  ) {
    setFilterError("Maximum price must be a non-negative whole number.");
    return;
  }

  if (
    guestCount !== undefined &&
    (!Number.isInteger(guestCount) || guestCount < 1)
  ) {
    setFilterError("Guests must be a whole number greater than 0.");
    return;
  }

  if (search.trim() !== "" && !isNaN(Number(search.trim()))) {
  setFilterError("City names cannot be a number.");
  return;
  }

  const params = new URLSearchParams();

  if (search.trim()) params.set("city", search.trim());
  if (price !== undefined) params.set("max_price", String(price));
  if (guestCount !== undefined) params.set("max_guests", String(guestCount));

  const query = params.toString();
  router.push(query ? `/?${query}` : "/");
};

  return (
    <>
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* City */}
      <Searchbar
        search={search}
        setSearch={setSearch}
      />

      {/* Maximum price */}
      <input
        type="number"
        min="1"
        placeholder="Max price / night"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300"
      />

      {/* Number of guests */}
      <input
        type="number"
        min="1"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300"
      />

      <button
        type="button"
        onClick={onFiltering}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Filter
      </button>
      
    </div>
    <div>{filterError && <p className="text-red-500" role="alert">{filterError}</p>}</div>
    </>
  );
}
