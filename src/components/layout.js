import Navbar from './Navbar'
import Footer from './Footer'
import { GraphQLClient } from 'graphql-request';

 
export default async function Layout({ children }) {
    const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
      });
      const query = `
  {
    sectionsCollection {
      items {
        title
        display
        articlesCollection(limit: 10) {
          total
          items {
            ... on Article {
              title
              description
              slug
              published
              color
              image {
                contentType
                url
              }
            }
          }
        }
      }
    }
  }
`;
try {
    const data = await graphQLClient.request(query);
    return {
      props: {
        sections: data.sectionsCollection.items,
      },
      revalidate: 10, // Sekunden für die inkrementelle statische Regeneration (ISR)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        sections: [],
      },
    };
  }
 
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
 
  return (
    <>
      <Navbar links={data.links} />
      <main>{children}</main>
      <Footer />
    </>
  )
}