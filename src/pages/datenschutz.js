import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link, UnorderedList, ListItem } from '@chakra-ui/react';
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
          <Heading textAlign="center" size="xl">
            Datenschutzerklärung
          </Heading>
          <Heading textAlign="center" opacity={0.3} mt={4} size="xs">
            zuletzt aktualisiert am 10. Mai 2024
          </Heading>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>1. Allgemeine Hinweise</Heading>
          <Text mb={4}>
            Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir Sie über die Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten bei der Nutzung unserer statischen Next.js Webseite mit Chakra UI.
          </Text>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>2. Verantwortlicher</Heading>
          <Text mb={4}>
            Verantwortlicher für die Datenverarbeitung auf dieser Webseite ist:
          </Text>
          <Text mb={4}>
            [Name des Verantwortlichen]  
            [Adresse des Verantwortlichen]  
            [E-Mail-Adresse des Verantwortlichen]  
            [Telefonnummer des Verantwortlichen]
          </Text>

          <Heading as="h2" size="lg" mt={6} mb={2}>3. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung</Heading>
          
          <Heading as="h3" size="md" mt={4} mb={2}>a) Beim Besuch der Webseite</Heading>
          <Text mb={4}>
            Beim Aufrufen unserer Webseite werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Webseite gesendet. Diese Informationen werden temporär in einem sogenannten Logfile gespeichert. Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:
          </Text>
          <UnorderedList mb={4}>
            <ListItem>IP-Adresse des anfragenden Rechners</ListItem>
            <ListItem>Datum und Uhrzeit des Zugriffs</ListItem>
            <ListItem>Name und URL der abgerufenen Datei</ListItem>
            <ListItem>Webseite, von der aus der Zugriff erfolgt (Referrer-URL)</ListItem>
            <ListItem>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers</ListItem>
          </UnorderedList>
          <Text mb={4}>
            Die genannten Daten werden durch uns zu folgenden Zwecken verarbeitet:
          </Text>
          <UnorderedList mb={4}>
            <ListItem>Gewährleistung eines reibungslosen Verbindungsaufbaus der Webseite</ListItem>
            <ListItem>Gewährleistung einer komfortablen Nutzung unserer Webseite</ListItem>
            <ListItem>Auswertung der Systemsicherheit und -stabilität sowie</ListItem>
            <ListItem>zu weiteren administrativen Zwecken</ListItem>
          </UnorderedList>
          <Text mb={4}>
            Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse folgt aus oben aufgelisteten Zwecken zur Datenerhebung. In keinem Fall verwenden wir die erhobenen Daten zu dem Zweck, Rückschlüsse auf Ihre Person zu ziehen.
          </Text>
          
          <Heading as="h3" size="md" mt={4} mb={2}>b) Nutzung von Kontaktformularen</Heading>
          <Text mb={4}>
            Sofern Sie uns über ein Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </Text>
          <Text mb={4}>
            Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt somit ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.
          </Text>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>4. Weitergabe von Daten</Heading>
          <Text mb={4}>
            Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
          </Text>
          <UnorderedList mb={4}>
            <ListItem>Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben,</ListItem>
            <ListItem>die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben,</ListItem>
            <ListItem>für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht, sowie</ListItem>
            <ListItem>dies gesetzlich zulässig und nach Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen mit Ihnen erforderlich ist.</ListItem>
          </UnorderedList>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>5. Cookies</Heading>
          <Text mb={4}>
            Unsere Webseite verwendet Cookies. Dies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden und die bestimmte Einstellungen und Daten zum Austausch mit unserem System über Ihren Browser speichern. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
          </Text>
          
          <Heading as="h3" size="md" mt={4} mb={2}>a) Verwendung von useColorMode</Heading>
          <Text mb={4}>
            Unsere Webseite nutzt die Funktion <code>useColorMode</code> von Chakra UI, um Ihre bevorzugte Farbmoduseinstellung (z.B. Hell- oder Dunkelmodus) zu speichern. Hierfür wird ein Cookie gesetzt.
          </Text>
          <UnorderedList mb={4}>
            <ListItem><strong>Name:</strong> chakra-ui-color-mode</ListItem>
            <ListItem><strong>Zweck:</strong> Speicherung der Farbmoduseinstellung (Hell- oder Dunkelmodus)</ListItem>
            <ListItem><strong>Speicherdauer:</strong> Bis zum Löschen durch den Benutzer</ListItem>
          </UnorderedList>
          <Text mb={4}>
            Die Verwendung der Cookies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der benutzerfreundlichen Gestaltung unserer Webseite.
          </Text>
          <Text mb={4}>
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Webseite eingeschränkt sein.
          </Text>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>6. Ihre Rechte</Heading>
          <Text mb={4}>
            Sie haben das Recht:
          </Text>
          <UnorderedList mb={4}>
            <ListItem>gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere können Sie Auskunft über die Verarbeitungszwecke, die Kategorie der personenbezogenen Daten, die Kategorien von Empfängern, gegenüber denen Ihre Daten offengelegt wurden oder werden, die geplante Speicherdauer, das Bestehen eines Rechts auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft Ihrer Daten, sofern diese nicht bei uns erhoben wurden, sowie über das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling und ggf. aussagekräftigen Informationen zu deren Einzelheiten verlangen;</ListItem>
            <ListItem>gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;</ListItem>
            <ListItem>gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist;</ListItem>
            <ListItem>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung eingelegt haben;</ListItem>
            <ListItem>gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen;</ListItem>
            <ListItem>gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr fortführen dürfen und</ListItem>
            <ListItem>gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Unternehmenssitzes wenden.</ListItem>
          </UnorderedList>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>7. Widerspruchsrecht</Heading>
          <Text mb={4}>
            Sofern Ihre personenbezogenen Daten auf Grundlage von berechtigten Interessen gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO verarbeitet werden, haben Sie das Recht, gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen, soweit dafür Gründe vorliegen, die sich aus Ihrer besonderen Situation ergeben oder sich der Widerspruch gegen Direktwerbung richtet. Im letzteren Fall haben Sie ein generelles Widerspruchsrecht, das ohne Angabe einer besonderen Situation von uns umgesetzt wird.
          </Text>
          <Text mb={4}>
            Möchten Sie von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch machen, genügt eine E-Mail an [E-Mail-Adresse des Verantwortlichen].
          </Text>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>8. Datensicherheit</Heading>
          <Text mb={4}>
            Wir verwenden innerhalb des Webseiten-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. In der Regel handelt es sich dabei um eine 256-Bit-Verschlüsselung. Falls Ihr Browser keine 256-Bit-Verschlüsselung unterstützt, greifen wir stattdessen auf 128-Bit-v3-Technologie zurück. Ob eine einzelne Seite unseres Internetauftrittes verschlüsselt übertragen wird, erkennen Sie an der geschlossenen Darstellung des Schlüssel- beziehungsweise Schloss-Symbols in der unteren Statusleiste Ihres Browsers.
          </Text>
          <Text mb={4}>
            Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
          </Text>
          
          <Heading as="h2" size="lg" mt={6} mb={2}>9. Aktualität und Änderung dieser Datenschutzerklärung</Heading>
          <Text mb={4}>
            Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Mai 2024.
          </Text>
          <Text mb={4}>
            Durch die Weiterentwicklung unserer Webseite und Angebote darüber oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Webseite unter [URL der Webseite] von Ihnen abgerufen und ausgedruckt werden.
          </Text>
        </Box>
        {data.image && (
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
        )}
      </Flex>
    </Flex>
  );
}
