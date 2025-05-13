import type { Metadata } from "next"

import { site } from "@/config/site"

interface MetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    url?: string
  }
}

function processSeoProps(props: MetadataProps = {}) {
  const baseUrl: string =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : (site.links.url as string)

  const baseTitle = props.title
    ? `${site.name.short} | ${props.title}`
    : site.name.default

  const description = props.description || site.description
  return {
    baseTitle,
    baseUrl,
    description,
    keywords: [...site.keywords, ...(props.keywords || [])].join(", "),
    openGraphDescription: props.openGraph?.description || description,
    openGraphUrl: `${baseUrl}${props.openGraph?.url || "/opengraph-image.png"}`,
  }
}

export function generateMetadata(props: MetadataProps = {}): Metadata {
  const {
    baseTitle,
    baseUrl,
    description,
    keywords,
    openGraphDescription,
    openGraphUrl,
  } = processSeoProps(props)

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
  }
}
export function generateStructuredData(props: MetadataProps = {}) {
  const { baseTitle, description } = processSeoProps(props)

  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": site.type,
      aggregateRating: {
        "@type": "AggregateRating",
        bestRating: site.rating.bestRating,
        ratingCount: site.rating.ratingCount,
        ratingValue: site.rating.ratingValue,
        worstRating: site.rating.worstRating,
      },
      applicationCategory: site.category,
      author: {
        "@type": "Person",
        name: site.author,
      },
      datePublished: site.datePublished,
      description,
      installUrl: site.links.url,
      name: baseTitle,
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "AUD",
      },
      operatingSystem: site.operatingSystem,
      requiresSubscription: false,
    }),
  }
}
