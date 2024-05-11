'use client'
import React, {useState} from 'react'
import { Box, Flex, Text, useBreakpointValue, Show, Hide } from '@chakra-ui/react';
import {SearchIcon, CloseIcon, HamburgerIcon} from '@chakra-ui/icons'
import Image from 'next/image';
import MyLink from './MyLink'
import icon from './Icon.svg'

export default function Navbar() {


  const darkmode = true;
  var menu = false;

  function setMenu(state: boolean){
    console.log(state);
    menu = state
  }
  return (
    <header>
    <nav style={{
      background: darkmode ? "rgba(8, 8, 8, 0.8)" : "rgba(249,249,249,0.8)"}}>
      <Box w={useBreakpointValue({base: "auto", xl: "1089px"})} h={menu ? "400px" : "50px"} alignContent="center" margin="auto" p={useBreakpointValue({base: 4, xl: 0})} color={darkmode ? "white" : "#080808"}>
      <Flex justify="space-between" align="center">
        <Image alt="Logo" src={icon} width={22} height={22} />

        <Show above='md'>
          <Flex onMouseEnter={()=> setMenu(true)} onMouseLeave={()=> setMenu(false)}>
            <MyLink href="#personal">Personal</MyLink>
            <MyLink href="about">Work</MyLink>
            <MyLink href="#home">Motion Design</MyLink>
            <MyLink href="#home">Developement</MyLink>
          </Flex>
        </Show>

        <Flex gap="32px">
          <SearchIcon />
          <Hide above='md'>
            <HamburgerIcon />
            {/* <CloseIcon /> */}
          </Hide>
        </Flex>
        
      </Flex>
    </Box>
    </nav>
    </header>
    
  )
}
