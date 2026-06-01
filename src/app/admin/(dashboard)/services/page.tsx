import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, Globe, Cpu } from "lucide-react";
import type { Metadata } from "next";
import DeleteServiceButton from "./DeleteServiceButton";

export const metadata: Metadata = { title: "Manage Services" };

async function getServices() {
  return prisma.service.findMany({ orderBy: { displayOrder: "asc" } });
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              marginBottom: 4,
            }}
          >
            Services
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Add, edit, or remove services shown on your website.
          </p>
        </div>
        <Link href="/admin/services/new" className="btn-primary">
          <Plus size={18} /> Add Service
        </Link>
      </div>

      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        {services.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No services yet. Click &quot;Add Service&quot; to create your first one.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Order</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "var(--radius-sm)",
                          background: "var(--accent-glow)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent-light)",
                        }}
                      >
                        {service.iconName === "cpu" ? (
                          <Cpu size={16} />
                        ) : (
                          <Globe size={16} />
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {service.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          /{service.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          service.category === "SOFTWARE"
                            ? "rgba(108, 92, 231, 0.15)"
                            : "rgba(0, 184, 148, 0.15)",
                        color:
                          service.category === "SOFTWARE"
                            ? "var(--accent-light)"
                            : "var(--emerald)",
                      }}
                    >
                      {service.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontFamily: "var(--font-display)" }}>
                    {formatPrice(service.startingPrice)}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: service.isActive
                          ? "rgba(0, 184, 148, 0.15)"
                          : "rgba(107, 107, 130, 0.15)",
                        color: service.isActive
                          ? "var(--emerald)"
                          : "var(--text-muted)",
                      }}
                    >
                      {service.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>{service.displayOrder}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="btn-secondary"
                        style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                      >
                        <Edit size={14} /> Edit
                      </Link>
                      <DeleteServiceButton serviceId={service.id} serviceTitle={service.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
