import type { Property } from "@/types/property";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image from 'next/image'
import T from "./typography";

type PropertyCardProps = {
  property: Property;
  className?: string;
};

export default function PropertyCard({
  property,
  className,
}: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.property_id}`}
      className={cn(
        "block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600",
        className,
      )}
    >
      <T.Header size="md">{property.title}</T.Header>
      {property.image_url ? (
        <Image
          src={property.image_url}
          width={300}
          height={200}
          alt={`${property.title} property`}
        />
      ) : (
        <div
          className="flex h-50 w-74 items-center justify-center bg-zinc-100 text-sm text-zinc-500"
          aria-label="No property image available"
        >
          No image available
        </div>
      )}
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {property.city}, {property.country}
      </p>
      <p className="mt-4 text-sm font-medium">
        {property.price_per_night} kr
        <span className="font-normal text-zinc-500"> / night</span>
      </p>
    </Link>
  );
}
