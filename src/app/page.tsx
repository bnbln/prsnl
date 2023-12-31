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
      <div className="opener">
        <p 
            style={{
              color: "#000",
              fontSize: "28px",
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "29px",
              letterSpacing: "1.02px",
              textTransform: "uppercase",
              pointerEvents: "all",
              textAlign: "center"
            }}>Benedikt <span style={{fontWeight: 300}}>Schnupp</span>
          </p>
      </div>
      <div className='overlay'
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
          <div style={{pointerEvents: "all"}} className='logo'>
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
          }}>Benedikt <span style={{fontWeight: 300}}>Schnupp</span>
        </p>

      </div>
        <div className='footer'
        style={{
          display: "flex",
          justifyContent: useBreakpointValue({base: "flex-start", md: "flex-end"}),
          marginBottom: useBreakpointValue({base: "100px", md: "0px"}),

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
