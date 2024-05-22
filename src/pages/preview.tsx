// pages/preview.tsx

import { GetServerSideProps } from 'next';
import { createClient } from 'contentful';
import Article from '@/components/Article';
import { ArticleData } from '@/components/Article'; // Ensure the interface is exported from Article component

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || '',
  host: 'preview.contentful.com', // Use the preview API
});

interface PreviewProps {
  article: ArticleData;
}

const Preview: React.FC<PreviewProps> = ({ article }) => {
  return <Article data={article} page={true} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  const entries = await contentfulClient.getEntries({
    content_type: 'article', // Adjust to your content type
    'fields.slug': slug,
  });

  const article = entries.items[0].fields;

  return {
    props: {
      article,
    },
  };
};

export default Preview;
