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

export async function getStaticPaths() {
  try {
    const entries = await client.getEntries<IArticleFields>({
      content_type: 'article',
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
      include: 2,
    });

    if (!entries.items.length) {
      return {
        notFound: true,
      };
    }

    const article = entries.items[0].fields;

    return {
      props: {
        data: article,
      },
      revalidate: 60, // Revalidate at most once every minute
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
