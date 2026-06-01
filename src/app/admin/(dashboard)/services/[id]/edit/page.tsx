import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/ServiceForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Service" };

async function getService(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return <ServiceForm initialData={service} />;
}
