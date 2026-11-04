"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid"

import PropertyCard from "@/components/PropertyCard"

import {
  deleteProperty,
  getMyProperties,
} from "@/utils/propertyService"

import type { Property } from "@/types/property"

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    getMyProperties()
      .then(setProperties)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load properties."
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (property: Property) => {
    setDeleteError("")

    const result = await deleteProperty(property.property_id)

    if (result.error) {
      setDeleteError(result.error)
      return
    }

    setProperties((current) =>
      current.filter(
        (item) => item.property_id !== property.property_id
      )
    )
  }

  return (
    <main className="mx-auto max-w-4xl p-6">

      <Link href="/auth/me" className="text-green-700">
        ← Back to My account
      </Link>

      <h1 className="text-3xl font-bold my-6">
        My properties
      </h1>

      {loading && <p>Loading properties…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p>You haven't added any properties yet.</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-7">

          {properties.map((property) => (
            <div key={property.property_id}>

              <PropertyCard property={property} />

              <div className="flex justify-between pb-3 mt-6 border-b">

                <Link
                  className="flex gap-1"
                  href={`/host/properties/${property.property_id}/edit`}
                >
                  <PencilSquareIcon className="text-green-700 h-6 w-6" />
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(property)}
                  className="flex gap-1 hover:text-red-600"
                >
                  <TrashIcon className="text-red-700 h-6 w-6" />
                  Delete
                </button>

              </div>

              {deleteError && (
                <p role="alert" className="text-red-400">
                  {deleteError}
                </p>
              )}

            </div>
          ))}

        </div>
      )}

    </main>
  )
}