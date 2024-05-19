import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link } from '@chakra-ui/react';
import Image from 'next/image';

export default function Impressum(data) {
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' }) || 'column';
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const contentWidth = useBreakpointValue({ base: '100%', md: '80%' });
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });

    return (
      <Flex
      justifyContent="center"
      direction={flexDirection}
      overflow="hidden"
      position="relative"
      w={containerWidth}
      mx="auto"
      borderRadius={4.5}
    >
      <Flex
        gap={4}
        direction="column"
        w={contentWidth}
        p={padding}
      >
        <Box>
          {data.description && (
            <Heading mt={2} textAlign="center" size="md">
              {data.description}
            </Heading>
          )}
            <Heading textAlign="center" size="xl">
              Impressum
            </Heading>
          {data.published && (
            <Heading textAlign="center" opacity={0.3} mt={4} size="xs">
              {formattedDate}
            </Heading>
          )}
            <Text textAlign="center" mt={4} fontSize={"lg"} fontWeight={300} pb={4}>Angaben gemäß § 5 TMG</Text>
            <Text>
              Benedikt Schnupp <br />
              Danziger Str. 126A <br />
              10407 Berlin <br />
              Deutschland
            </Text>
            <Heading mt={2} size="md">
              Kontakt
            </Heading>
            <Text>
            E-Mail: benediktschnupp@me.com
            </Text>
            <Heading mt={2} size="md">
            Verantwortlich für den Inhalt nach 55 Abs. 2 RStV
            </Heading>
            <Text>
            Benedikt Schnupp<br />
            Adresse wie oben
            </Text>
            <Heading mt={2} size="md">
            Haftungsausschluss
            </Heading>
            <Text>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </Text>
            <Heading mt={2} size="md">
            Urheberrecht
            </Heading>
            <Text>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </Text>
        </Box>
        {data.image &&
          <Image
            src={`https:${data.image.fields.file.url}`}
            alt={data.image.fields.title}
            width="900"
            height="500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              borderRadius: "4.5px",
              position: "relative",
              width: "100%"
            }}
          />
        }
        </Flex>
        </Flex>

    )
  }