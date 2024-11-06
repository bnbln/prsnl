import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading, VStack, useBreakpointValue, useColorMode, Text, Button, border } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import Cloud from '../components/Cloud'
//import Scene from '../app/Spline'
import Scene from '../components/Scene'
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";

interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position: any[];
}

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN  as string,
  space: process.env.CONTENTFUL_SPACE_ID  as string,
});

export async function getStaticProps() {
  try {
    const entries = await client.getEntries<ISection>({
      content_type: 'home',
      include: 2,
    });
    const mappedData = entries.items.map((item) => ({
      title: item.fields.title,
      hero: item.fields.hero,
      position: item.fields.position3,
    }));

    return {
      props: {
        data: mappedData,
      },
      revalidate: 60, // Optional: Revalidate at most once every minute
    };
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}
const Home: React.FC<{ data: ISection[] }> = ({ data }) => {
  const { colorMode } = useColorMode();
  const stateMachineName = "Motion";

  const {
    rive,
    RiveComponent: RiveComponentTouch
  } = useRive({
    src: "/logo.riv",
    stateMachines: stateMachineName,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const [isHovered, setIsHovered] = useState(false);

  const onPressedInput = useStateMachineInput(rive, stateMachineName, 'light');
  const onHoverInput = useStateMachineInput(rive, stateMachineName, 'Hover');

  useEffect(() => {
    if (onPressedInput) onPressedInput.value = colorMode === "dark" ? false : true;
    console.log(colorMode === "dark" ? false : true );
    
  }, [colorMode, onPressedInput]);

  function onMouseDown() {
    if (onPressedInput)  onPressedInput.value = colorMode === "dark" ? false : true;
    console.log("onMouseDown, onPressedInput = true");
    
  }

  function onMouseUp() {
    if (onPressedInput) onPressedInput.value = false;
    console.log("onMouseUp, onPressedInput = false");
  }

  function onMouseEnter() {
    if (onHoverInput) onHoverInput.value = true;
    setIsHovered(true);
    console.log("onMouseEnter, setIsHovered(true)");
  }

  function onMouseLeave() {
    if (onHoverInput) onHoverInput.value = false;
    setIsHovered(false);
    console.log("onMouseLeave, setIsHovered(false)");
  }

  return (
    <>
      <Box
        height="65vh"
        width="100%"
        position="relative"
        overflow="hidden"
        mb={12}
      >
        <video 
          playsInline 
          autoPlay 
          muted 
          className="heroVideo" 
          style={{
            filter: `invert(${colorMode === "dark" ? 0 : 1})`,
            mixBlendMode: colorMode === "dark" ? "plus-lighter" : "darken"
          }}
        >
          <source 
            src="./logo.mp4" 
            type='video/mp4"'/>
          <source 
            src="./logo.webm"
            type="video/webm" />
        </video>

        {/* <RiveComponentTouch
          className="base-canvas-size"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
        <p>Hover and click on the canvas</p>
        <p>Is cursor hovering? {isHovered ? 'Yes' : 'No'}</p> */}
        <Box position={'absolute'} left={0} top={-10} w={"100%"} h={150} zIndex={-1} backgroundColor={"#3362f0"} transform={"rotate(-3deg)"} filter={"blur(150px)"} />
      </Box>
      <VStack gap={useBreakpointValue({ base: "3rem", xl: "6rem" })} w="100%">
        {data[0] && data[0].position.map((section, index) => (
          <React.Fragment key={index}>
            {section.sys.contentType.sys.id === "sections" &&
              <Row title={section.fields.title} small={section.fields.display} items={section.fields.articles} />
            }
            {section.sys.contentType.sys.id === "module" && <Module data={section} />}
            {section.sys.contentType.sys.id === "article" && <Article page={false} data={section.fields} />}
            {section.sys.contentType.sys.id === "cloud" && <Cloud page={false} data={section.fields} />}
          </React.Fragment>
        ))}
      </VStack>
    </>
  );
}

export default Home;