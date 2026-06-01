import ServiceForm from "@/components/admin/ServiceForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add New Service" };

export default function NewServicePage() {
  return <ServiceForm />;
}
