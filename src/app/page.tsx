'use client'
import React from 'react'
import { useBreakpointValue } from '@chakra-ui/react'
import Spline from './Spline'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  ButtonGroup,
  Box
} from '@chakra-ui/react'

export default function Home() {
  const link = {
    color: "#FF7845",
    fontWeight: 800
  }
  return (
    <main style={{
      width: "100vw",
      height: "100vh"
    }}>
      <Spline />
      <div 
      style={{
        padding: useBreakpointValue({base: "34px 40px", xl: "74px 80px"}),
        height: "100vh",
        width: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        pointerEvents: "none"
      }}>
        <div style={{pointerEvents: "all"}}>
        {/* <WalkthroughPopover /> */}
        <p 
        style={{
          color: "#000",
          fontSize: "17px",
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "29px",
          letterSpacing: "1.02px",
          textTransform: "uppercase",
          pointerEvents: "all",
          marginTop: "-10px"
        }}>Benedikt <span 
        style={{
          fontWeight: 300
        }}>Schnupp</span>
        </p>
        </div>
        <div 
        style={{
          display: "flex",
          justifyContent: useBreakpointValue({base: "flex-start", md: "flex-end"}),
        }}>
          <p 
          style={{
            maxWidth: useBreakpointValue({base: "auto", md: "250px"}),
            textAlign: useBreakpointValue({base: "left", md: "right"}),
            pointerEvents: "all",
            fontWeight: 300,
            fontSize: useBreakpointValue({base: 14, md: 21, xl: 18}),
          }}>Im a Motion Designer and Web Developer from Berlin. This page is under construction, duh. For now connect with me on: <a style={link} target="_blank" href='https://www.linkedin.com/in/benedikt-schnupp-928112116/'>LinkedIn</a>
          </p>
        </div>
      </div>
    </main>
  )
}



function WalkthroughPopover() {
  const initialFocusRef = React.useRef()
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='bottom'
      closeOnBlur={false}
      onMouseOver={(event)=> console.log(event)}
    >
      <PopoverTrigger>
      <p 
        style={{
          color: "#000",
          fontSize: "17px",
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "29px",
          letterSpacing: "1.02px",
          textTransform: "uppercase",
          pointerEvents: "all",
          marginTop: "-10px"
        }}>Benedikt <span 
        style={{
          fontWeight: 300
        }}>Schnupp</span>
        </p>
      </PopoverTrigger>
      <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Manage Your Channels
        </PopoverHeader>
        <PopoverArrow bg='blue.800' />
        <PopoverCloseButton />
        <PopoverBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore.
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <Box fontSize='sm'>Step 2 of 4</Box>
          <ButtonGroup size='sm'>
            <Button colorScheme='green'>Setup Email</Button>
            <Button colorScheme='blue' ref={initialFocusRef}>
              Next
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}