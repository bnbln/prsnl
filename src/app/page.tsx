'use client'
import { useBreakpointValue } from '@chakra-ui/react'
import Spline from './Spline'

export default function Home() {
  const scene = {
    width: "100vw",
    height: "100vh"
  }
  const box = {
    display: "flex",
    justifyContent: useBreakpointValue({base: "flex-start", md: "flex-end"}),
  }
  const logoSpan = {
    fontWeight: 300
  }
  const text = {
    maxWidth: useBreakpointValue({base: "auto", md: "250px"}),
    textAlign: useBreakpointValue({base: "left", md: "right"}),
    pointerEvents: "all",
    fontWeight: 300,
    fontSize: useBreakpointValue({base: 14, md: 21, xl: 18}),
  }
  const link = {
    color: "#FF7845",
    fontWeight: 800
  
  }
  return (
    <main style={scene}>
      <Spline />
      <div style={{
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
        <p style={{
          color: "#000",
          leadingTrim: "both",
          textEdge: "cap",
          fontSize: "17px",
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "29px",
          letterSpacing: "1.02px",
          textTransform: "uppercase",
          pointerEvents: "all"
        }}>Benedikt <span style={logoSpan}>Schnupp</span></p>
        <div style={box}>
          <p style={text}>Im a Motion Designer and Web Developer from Berlin. This page is under construction, duh. For now connect with me on: <a style={link} target="_blank" href='https://www.linkedin.com/in/benedikt-schnupp-928112116/'>LinkedIn</a>
          </p>
        </div>
      </div>
    </main>
  )
}
