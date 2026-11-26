/**
 * Dados estruturados (JSON-LD) compartilhados.
 * A empresa é descrita uma vez aqui; as páginas apontam para ela pelo @id.
 */
import { brand, services } from "./content";
import { siteSeo } from "./seo";

export const businessId = `${brand.siteUrl}/#empresa`;
const home = `${brand.siteUrl}/`;

/** Empresa. Com endereço preenchido vira LocalBusiness com PostalAddress completo e geo. */
export function businessSchema() {
  const a = brand.address;
  return {
    "@context": "https://schema.org",
    "@type": a ? ["LocalBusiness", "ProfessionalService"] : "ProfessionalService",
    "@id": businessId,
    name: brand.name,
    slogan: brand.slogan,
    url: home,
    image: `${brand.siteUrl}/og-image.png`,
    logo: `${brand.siteUrl}/apple-touch-icon.png`,
    email: brand.email,
    telephone: brand.phone,
    taxID: brand.cnpj,
    description: siteSeo.defaultDescription,
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "Country", name: "Brasil" },
    ],
    address: a
      ? {
          "@type": "PostalAddress",
          streetAddress: a.streetAddress,
          addressLocality: a.addressLocality,
          addressRegion: a.addressRegion,
          postalCode: a.postalCode,
          addressCountry: "BR",
        }
      : { "@type": "PostalAddress", addressRegion: "SP", addressCountry: "BR" },
    ...(a?.geo ? { geo: { "@type": "GeoCoordinates", latitude: a.geo.latitude, longitude: a.geo.longitude } } : {}),
    ...(a?.mapsUrl ? { hasMap: a.mapsUrl } : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: brand.phone,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços Solution Play",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.schemaName,
          description: s.summary,
          ...(s.href ? { url: `${brand.siteUrl}${s.href}` } : {}),
        },
      })),
    },
  };
}

/** Referência curta à empresa, usada como "provider" e "publisher". */
export const businessRef = {
  "@type": brand.address ? ["LocalBusiness", "ProfessionalService"] : "ProfessionalService",
  "@id": businessId,
  name: brand.name,
  url: home,
  telephone: brand.phone,
};

type Area = { "@type": string; name: string };

export function serviceSchema(opts: {
  name: string;
  serviceType: string;
  url: string;
  description: string;
  areaServed?: Area | Area[];
  offers?: { name: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType,
    url: opts.url,
    description: opts.description,
    provider: businessRef,
    areaServed: opts.areaServed ?? { "@type": "State", name: "São Paulo" },
    ...(opts.offers?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: opts.serviceType,
            itemListElement: opts.offers.map((o) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: o.name, description: o.description },
            })),
          },
        }
      : {}),
  };
}

/** Caminho "Início / ... / Página". O primeiro item é sempre a home com barra final. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Início", url: home }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqSchema(faq: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
