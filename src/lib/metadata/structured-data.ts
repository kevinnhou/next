import type { SoftwareApplication, WithContext, AggregateRating, Person, Offer } from "schema-dts";
import { site } from "@/config/site";
import type { MetadataProps } from "./index";

function processSeoProps(props: MetadataProps = {}) {
  const baseUrl: string = site.links.url;

  const baseTitle = props.title
    ? `${site.name.short} | ${props.title}`
    : site.name.default;

  const description = props.description || site.description;
  return {
    baseTitle,
    baseUrl,
    description,
    keywords: [...site.keywords, ...(props.keywords || [])].join(", "),
    openGraphDescription: props.openGraph?.description || description,
    openGraphUrl: `${baseUrl}${props.openGraph?.url || "/opengraph-image.png"}`,
  };
}

export function validateStructuredData(data: unknown): data is WithContext<SoftwareApplication> {
  try {
    if (!data || typeof data !== "object") {
      return false;
    }

    const typedData = data as Record<string, unknown>;

    const hasValidContext = typedData["@context"] === "https://schema.org";
    const hasValidType = typedData["@type"] === "SoftwareApplication";
    const hasName = typeof typedData.name === "string" && typedData.name.length > 0;
    const hasDescription = typeof typedData.description === "string" && typedData.description.length > 0;

    const hasValidAuthor = 
      typedData.author && 
      typeof typedData.author === "object" && 
      (typedData.author as Record<string, unknown>)["@type"] === "Person";

    const hasValidOffers = 
      typedData.offers && 
      typeof typedData.offers === "object" && 
      (typedData.offers as Record<string, unknown>)["@type"] === "Offer";

    const hasValidRating = 
      typedData.aggregateRating && 
      typeof typedData.aggregateRating === "object" && 
      (typedData.aggregateRating as Record<string, unknown>)["@type"] === "AggregateRating";

    return Boolean(hasValidContext && hasValidType && hasName && hasDescription && 
           hasValidAuthor && hasValidOffers && hasValidRating);
  } catch (error) {
    console.error("Structured data validation error:", error);
    return false;
  }
}

export function isValidSchemaType(
  data: unknown,
  expectedType: string
): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }

  const typedData = data as Record<string, unknown>;
  
  return (
    typedData["@context"] === "https://schema.org" &&
    typedData["@type"] === expectedType
  );
}

export function createValidatedStructuredData(props: MetadataProps = {}) {
  const { baseTitle, description } = processSeoProps(props);

  const structuredData: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: baseTitle,
    description,
    applicationCategory: site.category || "WebApplication",
    author: {
      "@type": "Person",
      name: site.author.name || "",
    } as Person,
    datePublished: site.datePublished || new Date().toISOString(),
    installUrl: site.links.url,
    operatingSystem: site.operatingSystem || "Any",
    aggregateRating: site.rating.ratingCount > 0 ? {
      "@type": "AggregateRating",
      bestRating: site.rating.bestRating || 5,
      ratingCount: site.rating.ratingCount,
      ratingValue: site.rating.ratingValue || 0,
      worstRating: site.rating.worstRating || 1,
    } as AggregateRating : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
    } as Offer,
  };

  if (!validateStructuredData(structuredData)) {
    console.warn("Generated structured data failed validation");
  }

  return {
    __html: JSON.stringify(structuredData),
  };
}

export function generateStructuredData(props: MetadataProps = {}) {
  const { baseTitle, description } = processSeoProps(props);

  const structuredData: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": site.type as "SoftwareApplication",
    aggregateRating: {
      "@type": "AggregateRating",
      bestRating: site.rating.bestRating,
      ratingCount: site.rating.ratingCount,
      ratingValue: site.rating.ratingValue,
      worstRating: site.rating.worstRating,
    } as AggregateRating,
    applicationCategory: site.category,
    author: {
      "@type": "Person",
      name: site.author.name,
    } as Person,
    datePublished: site.datePublished,
    description,
    installUrl: site.links.url,
    name: baseTitle,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
    } as Offer,
    operatingSystem: site.operatingSystem,
  };

  return {
    __html: JSON.stringify(structuredData),
  };
}

export interface AsyncStructuredDataOptions {
  fetchFn?: () => Promise<Partial<MetadataProps>>;
  fallback?: MetadataProps;
  params?: Record<string, any>;
  searchParams?: Record<string, any>;
}

export async function generateStructuredDataAsync(
  options: AsyncStructuredDataOptions = {}
) {
  const { fetchFn, fallback = {}, params, searchParams } = options;
  
  let dynamicProps: Partial<MetadataProps> = {};
  
  if (fetchFn) {
    try {
      dynamicProps = await fetchFn();
    } catch (error) {
      console.warn("Failed to fetch dynamic structured data, using fallback:", error);
      dynamicProps = fallback;
    }
  }
  
  const mergedProps: MetadataProps = {
    ...fallback,
    ...dynamicProps,
    ...(params && { params }),
    ...(searchParams && { searchParams }),
  };
  
  return generateStructuredData(mergedProps);
}

export async function generatePageStructuredData(
  params: Promise<Record<string, string>>,
  searchParams: Promise<Record<string, any>>,
  fetchFn?: (resolvedParams: Record<string, string>, resolvedSearchParams: Record<string, any>) => Promise<Partial<MetadataProps>>,
  fallback: MetadataProps = {}
) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  let dynamicProps: Partial<MetadataProps> = {};
  
  if (fetchFn) {
    try {
      dynamicProps = await fetchFn(resolvedParams, resolvedSearchParams);
    } catch (error) {
      console.warn("Failed to fetch page structured data, using fallback:", error);
      dynamicProps = fallback;
    }
  }
  
  const mergedProps: MetadataProps = {
    ...fallback,
    ...dynamicProps,
  };
  
  return generateStructuredData(mergedProps);
}