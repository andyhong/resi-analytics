import { useState } from 'react'
import { Box, Flex, Heading, Text, Button, Link } from '@chakra-ui/core'
import axios from 'axios'
import { FaRunning } from 'react-icons/fa'
import NextLink from 'next/link'

import EventCard from '../components/EventCard'

const Home = () => {
  const [services, setServices] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const runReport = async () => {
    setIsLoading(true)
    const response = await axios(`/api/run`)
    setServices(response.data)
    setIsLoading(false)
  }

  return (
    <Box h="100vh" maxW="50rem" mx="auto">
      <Flex py="4rem" px="2rem" mx="auto" direction="column" justify="center" align="center">
        <Heading size="2xl" textAlign="center" letterSpacing="tighter" lineHeight="0.8">
          Mariners Church <br /> Livestream Analytics
        </Heading>
        <Text mt={4} textAlign="center" letterSpacing="tight" fontSize="lg">
          Welcome! This is an internal tool that can be used to pull livestream viewer data on demand. Clicking "Run" will query all services streamed within the <Text as="b">last 7 days</Text> and display them below. If you need to reference past services that are outside of the 7 day range, <NextLink href="/services" passHref>
            <Link><Text as="u" fontWeight="medium">click here.</Text></Link>
          </NextLink>
        </Text>
        <Button my={4} size="lg" colorScheme="green" onClick={runReport} isLoading={isLoading} loadingText="Looking for services..." leftIcon={<FaRunning />}>Run</Button>

        <Flex direction="row" wrap="wrap" justify="center">
          {services && <>
            {services.map(service => (
              <EventCard key={service.uuid} service={service} />
            ))}
          </>}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Home
