import type { Metadata } from "next";
import { site } from "@/config/site";

export interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
  };
}

export interface AsyncMetadataOptions {
  fetchFn?: () => Promise<Partial<MetadataProps>>;
  fallback?: MetadataProps;
  params?: Record<string, any>;
  searchParams?: Record<string, any>;
}

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

export function generateMetadata(props: MetadataProps = {}): Metadata {
  const {
    baseTitle,
    baseUrl,
    description,
    keywords,
    openGraphDescription,
    openGraphUrl,
  } = processSeoProps(props);

  return {
    applicationName: site.name.default,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    openGraph: {
      description: openGraphDescription,
      locale: "en_AU",
      siteName: baseTitle,
      title: baseTitle,
      type: "website",
      url: openGraphUrl,
    },
    title: baseTitle,
    twitter: {
      card: "summary_large_image",
      creator: site.author.tag,
      description: openGraphDescription,
      title: baseTitle,
    },
  };
}

export async function generateMetadataAsync(
  options: AsyncMetadataOptions = {}
): Promise<Metadata> {
  const { fetchFn, fallback = {}, params, searchParams } = options;
  
  let dynamicProps: Partial<MetadataProps> = {};
  
  if (fetchFn) {
    try {
      dynamicProps = await fetchFn();
    } catch (error) {
      console.warn("Failed to fetch dynamic metadata, using fallback:", error);
      dynamicProps = fallback;
    }
  }
  
  const mergedProps: MetadataProps = {
    ...fallback,
    ...dynamicProps,
    ...(params && { params }),
    ...(searchParams && { searchParams }),
  };
  
  return generateMetadata(mergedProps);
}

export async function generatePageMetadata(
  params: Promise<Record<string, string>>,
  searchParams: Promise<Record<string, any>>,
  fetchFn?: (resolvedParams: Record<string, string>, resolvedSearchParams: Record<string, any>) => Promise<Partial<MetadataProps>>,
  fallback: MetadataProps = {}
): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  let dynamicProps: Partial<MetadataProps> = {};
  
  if (fetchFn) {
    try {
      dynamicProps = await fetchFn(resolvedParams, resolvedSearchParams);
    } catch (error) {
      console.warn("Failed to fetch page metadata, using fallback:", error);
      dynamicProps = fallback;
    }
  }
  
  const mergedProps: MetadataProps = {
    ...fallback,
    ...dynamicProps,
  };
  
  return generateMetadata(mergedProps);
}

// Export all structured data functions from structured-data.ts
export {
  validateStructuredData,
  createValidatedStructuredData,
  isValidSchemaType,
  generateStructuredData,
  generateStructuredDataAsync,
  generatePageStructuredData,
  type AsyncStructuredDataOptions,
} from "./structured-data"; 