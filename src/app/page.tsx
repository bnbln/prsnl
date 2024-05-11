'use client'
import React from 'react'
import {
  Box
} from '@chakra-ui/react'
import Row from './components/Row'
import { data } from './data'


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


    {data.map((section, index) => (
      <Row key={index} title={section.title} small={section.small} items={section.items} />
    ))}
    </>
  )
}
