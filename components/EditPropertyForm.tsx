"use client";

import { useRouter } from "next/navigation";
import PropertyForm, {
  type PropertyFormValues,
} from "@/components/PropertyForm";
import { updateProperty } from "@/utils/propertyService";

type EditPropertyFormProps = {
  propertyId: string;
  values: PropertyFormValues;
};

export default function EditPropertyForm({
  propertyId,
  values,
}: EditPropertyFormProps) {
  const router = useRouter();

  async function handleUpdate(formData: FormData) {
    const result = await updateProperty(propertyId, formData);

    if (result.propertyId) {
      router.push("/auth/me");
    }

    return result;
  }

  return (
    <PropertyForm
      action={handleUpdate}
      values={values}
      submitLabel="Save changes"
      pendingLabel="Saving..."
    />
  );
}