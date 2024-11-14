import React from 'react';
import { Box } from '@chakra-ui/react';
import { createClient, EntrySkeletonType, EntryFields } from 'contentful';
import Article from '@/components/Article';
import { Document } from '@contentful/rich-text-types';
// Define the interface for the Article fields
interface IArticleFields extends EntrySkeletonType {
  title: EntryFields.Text;
  published: EntryFields.Text;
  subtitle?: EntryFields.Text;
  slug: EntryFields.Text;
  text?: Document;  // Updated to use Document type from '@contentful/rich-text-types'
  image?: {
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

export async function getStaticPaths() {
  try {
    const entries = await client.getEntries<IArticleFields>({
      content_type: 'article',
      include: 1,
    });

    const paths = entries.items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    return {
      paths,
      fallback: true, // 'blocking' can also be used if required
    };
  } catch (error) {
    console.error("Error fetching paths from Contentful:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }: Params) {
  try {
    const entries = await client.getEntries<IArticleFields>({
      content_type: 'article',
      'fields.slug': params.slug,
      include: 1,
    });

    if (!entries.items.length) {
      return {
        notFound: true,
      };
    }

    // Create a simplified version of the article
    const article = entries.items[0].fields;
    
    // Process the related articles to avoid circular references
    const processedArticle = {
      ...article,
      related: article.related && isRelatedArticleArray(article.related) 
        ? article.related.map((relatedArticle) => ({
            fields: {
              title: relatedArticle.fields.title,
              slug: relatedArticle.fields.slug,
              description: relatedArticle.fields.description || null,
              image: relatedArticle.fields.image || null,
            }
          }))
        : null
    };
    
    return {
      props: {
        data: processedArticle,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return {
      props: {
        data: null,
      },
    };
  }
}

const Slug: React.FC<{ data: IArticleFields | null }> = ({ data }) => {
  if (!data) {
    return <Box>No data found</Box>;
  }

  return (
      <Article data={data} page={true} />
  );
}

export default Slug;
