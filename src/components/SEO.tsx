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
  const { locales, defaultLocale, asPath, locale } = router;

  const seo = {
    title: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    image: image || DEFAULT_OG_IMAGE,
    url: `${SITE_URL}${router.asPath}`
  };

  // Construct the canonical URL *without* the locale for the default language
  const canonicalPath = defaultLocale === locale
      ? asPath.replace(`/${locale}`, '') // Remove locale prefix if it's the default
      : asPath;
  // Ensure leading slash if root path
  const finalCanonicalPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${SITE_URL}${finalCanonicalPath === '/' ? '' : finalCanonicalPath}`;

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
      <meta property="og:locale" content={locale?.replace('-', '_')} />
      {(locales || []).filter(loc => loc !== locale).map(loc => (
         <meta key={loc} property="og:locale:alternate" content={loc.replace('-', '_')} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Hreflang Links */}
      {(locales || []).map((loc) => {
        // Construct the URL for this specific locale
        const localePath = defaultLocale === loc
          ? asPath.replace(`/${locale}`, '') // Path for default locale might not have prefix
          : `/${loc}${asPath.replace(`/${locale}`, '')}`; // Add prefix for non-default locales
        const finalLocalePath = localePath.startsWith('/') ? localePath : `/${localePath}`;
        const href = `${SITE_URL}${finalLocalePath === '/' ? '' : finalLocalePath}`;
        return <link key={loc} rel="alternate" hrefLang={loc} href={href} />;
      })}

      {/* Default hreflang */}
       <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${asPath.replace(`/${locale}`, '') === '/' ? '' : asPath.replace(`/${locale}`, '')}`} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
} 