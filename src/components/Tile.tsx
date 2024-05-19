import React from 'react';
import {
  Heading,
  Text,
  Box,
  useBreakpointValue
} from '@chakra-ui/react';
import Image from 'next/image';

type TileProps = {
  title: string;
  desc?: string;
  small?: boolean;
  video?: string;
  image?: any;
  color?: string;
  slug: string;
}

const Tile: React.FC<TileProps> = ({ small = true, video, image, title, desc, color, slug }) => {
  const isImage = image?.fields?.file?.contentType.includes("image");
  const isVideo = image?.fields?.file?.contentType.includes("video");

  return (
    <Box
      as='a'
      href={`./${slug}`}
      className='tile'
      sx={{
        '&:first-child': {
          marginLeft: useBreakpointValue({ base: 4, xl: 'calc( var(--gutter-size) + 12px)' }),
        },
        '&:last-child': {
          marginRight: useBreakpointValue({ base: 4, xl: 'calc(var(--gutter-size) - 12px)' }),
        }
      }}
    >
      <div style={{
        height: "29.471875rem",
        borderRadius: "4.5px",
        background: color || "teal",
        color: "white",
        aspectRatio: small ? "3/4" : "4/3",
        position: "relative",
        overflow: "hidden",
      }}>
        {isImage && (
          <Image
          src={`https:${image.fields.file.url}`}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 
                   (max-width: 1200px) 50vw, 
                   33vw"
          style={{ 
            objectFit: "cover",
            borderRadius: "4.5px"
          }}
        />
        )}

        {isVideo && (
          <video
            playsInline
            autoPlay
            loop
            muted
            style={{
              height: "29.471875rem",
              borderRadius: "4.5px",
              aspectRatio: small ? "3/4" : "4/3",
              position: "absolute",
              top: 0,
              left: 0
            }}
            src={`https:${image.fields.file.url}`}
          />
        )}

        <Box style={{
          padding: 18,
          flexDirection: "column",
          justifyContent: "space-between",
          height: "29.471875rem",
          borderRadius: "4.5px",
          color: "white",
          display: "flex",
          position: "relative",
          width: "100%",
          zIndex: 10,
          //background: isImage ? "rgba(0, 0, 0, 0.4)" : "none", // Optional: dark overlay for text readability
        }}>
          <Text>{desc}</Text>
          <Heading fontSize='xl'>{title}</Heading>
        </Box>
      </div>
    </Box>
  );
}

export default Tile;
