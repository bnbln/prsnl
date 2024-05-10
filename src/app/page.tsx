'use client'
import React from 'react'
import * as contentful from 'contentful'
import MyCanvas from './Animation'
import {
  Box
} from '@chakra-ui/react'
import Row from './components/Row'


const data = [
  {
    title: "Developement", 
    small: true, 
    items: [
      {
        title: "Integrating a custom Spinner Animation with LottieJS", 
        desc: "Interaction",
        color: "#9AADD5",
        video: "./Portrait01.mp4"
      },
      {
        title: "Programmatic Typography Systems", 
        desc: "Typography",
        image: "./Portrait02.jpg"
      },
      {
        title: "Generating advanced QR-Codes with Stable Diffusion", 
        desc: "Artificial Intelligence",
        image: "./Portrait04.jpg"
      },
      {
        title: "Relaunching a Berlin Lawyers Corporate Design and Website", 
        desc: "Clients",
        color: "#172340",
      },
      {
        title: "Automating Video Workflows in Trailer Production for TV Channel", 
        desc: "Clients",
        color: "#f18825",
      }
    ]
  },
  {
    title: "Motion Design", 
    small: false, 
    items: [
      {
        title: "Problem Solving Strategy: Just don't stop!", 
        desc: "Artificial Intelligence",
        color: "#9AADD5",
        video: "./Landscape01.mp4"
      },
      {
        title: "Programmatic Typography Systems", 
        desc: "Typography",
        color: "#9AADD5",
        image: "./Portrait02.jpg"
      },
      {
        title: "Integrating a custom Spinner Animation with LottieJS", 
        desc: "Interaction",
        color: "#9AADD5",
        video: "./Portrait01.mp4"
      },
      {
        title: "Automating Video Workflows in Trailer Production for TV Channel", 
        desc: "Clients",
        color: "#f18825",
      }
    ]
  }
]

export default function Home() {

  
  return (
    <>
    {/* <MyCanvas /> */}
    {/* <Spline /> */}
    <Box zIndex={0} maxH='65vh' color='white'>
    <video autoPlay muted style={{
            minWidth: "100%",
            borderRadius: 4.5,
            }} src="./Hero.mp4"/>
    </Box>


    {data.map((section, index) => {
      // console.log(section, index);
      return(
        <Row key={index} title={section.title} small={section.small} items={section.items} />
      )

    })}
    </>
  )
}
