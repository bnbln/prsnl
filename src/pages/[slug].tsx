import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { createClient } from 'contentful';
import Article from '@/components/Article';


// Define types for the data you expect from Contentful
interface IArticle {
  title: string;
  slug: string;
  published: string;
  description: string;
  color: string;
  image: any;
  video: any;
  excerpt: any;
  text: any;
  related: any[];
}

// Create the Contentful client outside the component to avoid re-creation on re-renders
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID,
});

export async function getStaticPaths() {
  try {
    const entries = await client.getEntries<IArticle>({
      content_type: 'article',
    });

    const paths = entries.items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    return {
      paths,
      fallback: true, // or 'blocking' if you want to block the page from rendering until it's generated
    };
  } catch (error) {
    console.error("Error fetching paths from Contentful:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const entries = await client.getEntries<IArticle>({
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
      revalidate: 60, // Optional: Revalidate at most once every minute
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

const Slug: React.FC<{ data: IArticle | null }> = ({ data }) => {
  if (!data) {
    return <Box>No data found</Box>;
  }
  console.log("article page", data);
  
  return (
    <>
    <Article data={data} />
      <Box
        height="75vh"
        width="100%"
        position="relative"
        overflow="hidden"
        pt={45}
        color="white"
      >
        {/* Add more components to display other fields as needed */}
      </Box>
    </>
  );
}

export default Slug;
