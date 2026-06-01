try { require("dotenv/config"); } catch {}
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@aipinc.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: "AIP Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create demo customer
  const customerEmail = "customer@aipinc.com";
  const customerPassword = "customer123";
  const customerHash = await bcrypt.hash(customerPassword, 12);

  const customer = await prisma.customer.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      email: customerEmail,
      passwordHash: customerHash,
      name: "Demo Customer",
      phone: "+1 (555) 999-0000",
      company: "Demo Corp",
    },
  });
  console.log("Demo customer created:", customer.email);

  const services = [
    {
      title: "Website Development",
      slug: "website-development",
      category: "SOFTWARE",
      description: "We build stunning, high-performance websites tailored to your business needs. From sleek landing pages to full-featured web applications, our team delivers pixel-perfect designs with modern technologies.\n\nOur websites are built with SEO best practices, mobile responsiveness, and blazing-fast load times. Whether you need an e-commerce platform, a corporate site, or a custom web application, we've got you covered.",
      shortDescription: "Custom websites built with modern technologies. From landing pages to full-scale web applications.",
      startingPrice: 49900,
      features: JSON.stringify(["Fully Responsive Design","SEO Optimized","Custom UI/UX Design","Content Management System","Performance Optimization","SSL & Security Setup","Analytics Integration","3 Rounds of Revisions"]),
      iconName: "globe",
      isActive: true,
      displayOrder: 1,
    },
    {
      title: "Hardware Project Guidance",
      slug: "hardware-project-guidance",
      category: "HARDWARE",
      description: "Get expert guidance on your hardware projects from concept to completion. We provide consultation, component selection, prototyping assistance, and technical documentation for IoT devices, embedded systems, and custom hardware solutions.\n\nWhether you're building a proof of concept for investors or need hands-on help with circuit design and firmware development, our engineers are here to guide you every step of the way.",
      shortDescription: "Expert guidance for IoT, embedded systems, and custom hardware projects \u2014 from concept to prototype.",
      startingPrice: 29900,
      features: JSON.stringify(["Project Consultation","Component Selection","Circuit Design Review","Firmware Development Guidance","Prototype Assistance","Technical Documentation","Bill of Materials (BOM)","2 Follow-up Sessions"]),
      iconName: "cpu",
      isActive: true,
      displayOrder: 2,
    },
  ];

  for (const service of services) {
    const result = await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    console.log("Service created:", result.title);
  }

  const settings = [
    { key: "company_name", value: "AIP Inc", label: "Company Name", group: "BRANDING" },
    { key: "company_tagline", value: "Building the Future, One Solution at a Time", label: "Tagline", group: "BRANDING" },
    { key: "theme_color", value: "#3b82f6", label: "Theme Color", group: "BRANDING" },
    { key: "currency", value: "USD", label: "Currency", group: "BRANDING" },
    { key: "company_email", value: "hello@aipinc.com", label: "Contact Email", group: "CONTACT" },
    { key: "company_phone", value: "+1 (555) 123-4567", label: "Phone Number", group: "CONTACT" },
    { key: "company_address", value: "123 Innovation Drive, Suite 100, San Francisco, CA 94105", label: "Physical Address", group: "CONTACT" },
    { key: "social_twitter", value: "https://twitter.com/aipinc", label: "Twitter / X", group: "SOCIAL" },
    { key: "social_linkedin", value: "https://linkedin.com/company/aipinc", label: "LinkedIn", group: "SOCIAL" },
    { key: "social_github", value: "https://github.com/aipinc", label: "GitHub", group: "SOCIAL" },
  ];

  for (const setting of settings) {
    const result = await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
    console.log("Setting created:", result.key, "=", result.value);
  }

  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma["$disconnect"]();
  });
