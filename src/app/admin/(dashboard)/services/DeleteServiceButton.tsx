"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteServiceButton({
  serviceId,
  serviceTitle,
}: {
  serviceId: string;
  serviceTitle: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${serviceTitle}"? This action cannot be undone.`)) {
      return;
    }

    const res = await fetch(`/api/services/${serviceId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete service. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn-danger"
      style={{ padding: "6px 14px", fontSize: "0.8rem" }}
    >
      <Trash2 size={14} />
    </button>
  );
}
