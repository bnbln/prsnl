import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

const DEFAULT_TITLE = "Design und Code - Benedikt Schnupp";
const DEFAULT_DESCRIPTION = "Your default site description";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://benedikt.berlin';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export default function SEO({
  title,
  description,
  image,
  article
}: SEOProps) {
  const router = useRouter();
  const seo = {
    title: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    image: image || DEFAULT_OG_IMAGE,
    url: `${SITE_URL}${router.asPath}`
  };

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <link rel="canonical" href={seo.url} />
    </Head>
  );
} 