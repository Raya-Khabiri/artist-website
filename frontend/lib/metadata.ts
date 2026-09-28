import type { Metadata } from "next";

type CreatePageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string | null;
  imageAlt?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  image,
  imageAlt,
}: CreatePageMetadataOptions): Metadata {
  const socialTitle = `${title} | EAMORA`;

  const socialImage = image || "/images/eamora-hero.jpg";

  const socialImageAlt = imageAlt || "Featured EAMORA artwork";

  return {
    title,
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      type: "website",
      locale: "en_GB",
      url: path,
      siteName: "EAMORA",
      title: socialTitle,
      description,
      images: [
        {
          url: socialImage,
          alt: socialImageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
          noarchive: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
