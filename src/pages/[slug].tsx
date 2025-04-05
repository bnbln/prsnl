import React from 'react';
import { Box } from '@chakra-ui/react';
import { createClient, EntrySkeletonType, EntryFields } from 'contentful';
import Article, { ArticleData } from '@/components/Article';
import { Document } from '@contentful/rich-text-types';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getMenuData, getFooterData } from '../hooks/useMenuData';

// Define the type for an image asset (you might already have a similar type like AssetFields)
// If you don't have AssetFields defined or imported, you might need to define it like this:
interface AssetFields {
  title: string;
  description?: string;
  file: {
    url: string;
    details: {
      size: number;
      image?: {
        width: number;
        height: number;
      };
    };
    fileName: string;
    contentType: string;
  };
}

// Add this type extension to include the missing fields
interface ExtendedArticleData extends ArticleData {
  subtitle?: string;
  button?: Array<{
    fields?: {
      title?: string;
      url?: string;
      variant?: boolean;
    }
  }>;
  videoHeader?: {
    fields: {
      title: string;
      file: {
        url: string;
        contentType: string;
      }
    }
  };
  // Add the missing imageLandscape property
  imageLandscape?: {
    fields: AssetFields; // Use the appropriate type for your image assets
  } | null; // Make it optional and allow null if needed
  // Add any other fields that exist in IArticleFields but not in ArticleData
}

// Define the interface for the Article fields
interface IArticleFields extends EntrySkeletonType {
  title: EntryFields.Text;
  published: EntryFields.Text;
  subtitle?: EntryFields.Text;
  slug: EntryFields.Text;
  description?: EntryFields.Text;
  excerpts?: EntryFields.Text;
  text?: Document;  // Updated to use Document type from '@contentful/rich-text-types'
  color?: EntryFields.Text;
  image?: {
    fields: {
      title: string;
      file: {
        url: string;
        contentType: string;
      };
    };
  };
  videoHeader?: {
    fields: {
      title: string;
      file: {
        url: string;
        contentType: string;
      };
    };
  };
  button?: Array<{
    title: string;
    uri: string;
    variant: boolean;
  }>;
  related?: Array<{
    fields: {
      title: string;
      slug: string;
      published?: string;
      description?: string;
      image?: {
        fields: {
          title: string;
          file: {
            url: string;
            contentType: string;
          };
        };
      };
    };
    sys?: {
      id: string;
      contentType: {
        sys: {
          id: string;
        };
      };
    };
  }>;
}

// Define the interface for the Params
interface Params {
  params: {
    slug: string;
  };
}

// Create the Contentful client outside the component to avoid re-creation on re-renders
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.CONTENTFUL_SPACE_ID as string,
});

interface RelatedArticle {
  fields: {
    title: string;
    slug: string;
    published?: string;
    description?: string;
    image?: {
      fields: {
        title: string;
        file: {
          url: string;
          contentType: string;
        };
      };
    };
  };
}

// Add this type guard function before getStaticProps
function isRelatedArticleArray(related: any): related is RelatedArticle[] {
  return Array.isArray(related) && related.every(item => 
    item?.fields?.title && item?.fields?.slug
  );
}

// --- Define mapContentfulData ---
// This function maps the raw Contentful entry data to the ArticleData structure.
function mapContentfulData(entry: any): ExtendedArticleData | null {
  if (!entry || !entry.fields) {
    console.warn("mapContentfulData received invalid entry:", entry);
    return null;
  }

  const fields = entry.fields;

  // Map all fields, ensuring undefined becomes null for serialization
  return {
    title: fields.title ?? null, // Also handle potentially missing required fields gracefully
    slug: fields.slug ?? null,   // Add null check for required fields too if needed
    published: fields.published ?? null, // Add null check for required fields too if needed
    description: fields.description ?? null, // Use ?? null
    excerpts: fields.excerpts ?? null,     // Use ?? null
    text: fields.text ?? null,             // Use ?? null
    color: fields.color ?? null,           // Use ?? null
    image: fields.image ?? null,           // Use ?? null (already handles null/undefined)
    imageLandscape: fields.imageLandscape ?? null, // Use ?? null
    videoHeader: fields.videoHeader ?? null, // Use ?? null
    button: fields.button ?? null,         // Use ?? null
    related: fields.related ?? null,       // Use ?? null
    // Add any other fields that might be in your Contentful data
    subtitle: fields.subtitle ?? null,     // Ensure all optional fields in ExtendedArticleData are handled
  };
}



// --- Update getStaticPaths ---
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: Array<{ params: { slug: string }; locale: string }> = []; // Explicitly type paths array

  try {
    // Iterate through each configured locale
    for (const locale of locales || []) {
      // Fetch entries *specifically for this locale*
      const entries = await client.getEntries<IArticleFields>({
        content_type: 'article',
        select: ['fields.slug'], // Select only the slug field
        locale: locale, // <<< Fetch slugs for the current locale
      });

      // Create paths for the slugs found *in this locale*
      for (const item of entries.items) {
        // Ensure the slug field exists and has a value for this locale
        if (item.fields.slug) {
          paths.push({
            params: { slug: item.fields.slug as string },
            locale: locale, // Specify the locale for this path
          });
        } else {
          // Optional: Log if an entry for a locale is missing a slug
          // console.warn(`Entry ${item.sys.id} is missing a slug for locale ${locale}`);
        }
      }
    }

    return {
      paths,
      fallback: true, // Keep fallback true to handle previews or on-demand generation
    };
  } catch (error) {
    console.error("Error fetching paths from Contentful:", error);
    return {
      paths: [], // Return empty paths on error
      fallback: true,
    };
  }
};

// --- Update getStaticProps ---
export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const locale = context.locale;

  if (!slug || !locale) {
    return { notFound: true };
  }

  try {
    // Fetch menu and footer data
    const menuData = await getMenuData();
    const footerData = await getFooterData();

    // Fetch article data
    const entries = await client.getEntries<IArticleFields>({
      content_type: 'article',
      'fields.slug': slug,
      locale: locale,
      include: 2,
      limit: 1
    });

    if (!entries.items || entries.items.length === 0) {
      return { notFound: true };
    }

    const articleData = mapContentfulData(entries.items[0]);

    if (!articleData) {
      return { notFound: true };
    }

    return {
      props: {
        data: articleData,
        navData: menuData[0],
        footerData: footerData[0],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`Error fetching data for slug "${slug}" in locale "${locale}":`, error);
    return { notFound: true };
  }
};

const Slug: React.FC<{ data: ExtendedArticleData | null }> = ({ data }) => {
  if (!data) {
    return <Box>No data found</Box>;
  }

  return (
      <Article data={data} page={true} />
  );
}

export default Slug;
