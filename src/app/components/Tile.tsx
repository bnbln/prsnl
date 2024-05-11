import React from 'react'
import {
  Heading,
  Text,
  Box,
  useBreakpointValue
} from '@chakra-ui/react'
import  Image from 'next/image'
import { relative } from 'path';


type TileProps = {
    title: string
    desc: string
    small?: boolean; // Markiert als optional mit einem Standardwert unten
    video?: string;
    image?: string;
    color?: string;
}

const Tile: React.FC<TileProps> = ({ small = true, video, image, title, desc, color }) => {
  // Bedingter Render basierend auf 'small'
  return (
    <Box as='a' href='#home' className='tile' 
    sx={{
      '&:first-child': {
        marginLeft: useBreakpointValue({base: 4, xl: 'var(--gutter-size)'}),
      },
      '&:last-child': {
        marginRight: useBreakpointValue({base: 4, xl: 'calc( var(--gutter-size) - 12px)'}),
      }
    }}>
    <div style={{
        height: "29.471875rem",
        borderRadius: 4.5,
        background: color ? color : "teal",
        color: "white",
        aspectRatio: small ? "3/4" : "4/3",
        position: "relative",
        backgroundSize: "cover",
        backgroundImage: image ? "url("+ image +")" : "none",
        backgroundPosition: "center"
    }}>

        { video ? 
        
            <video playsInline autoPlay loop muted style={{
            height: "29.471875rem",
            borderRadius: 4.5,
            aspectRatio: small ? "3/4" : "4/3",
            position: "absolute",
            top: 0,
            left: 0
            }} src={video}/>
        
    : null }


        <Box style={{
            padding: 18, 
            flexDirection: 
            "column",
            justifyContent: "space-between",
            height: "29.471875rem",
            borderRadius: 4.5,
            color: "white",
            display: "flex",
            position: "relative",
            width: "100%",
            zIndex:10
        }}>
            <Text>{desc}</Text>
            <Heading fontSize='xl'>{title}</Heading>
        </Box>

        
    </div>
    </Box>
  );
}

export default Tile;
