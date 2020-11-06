import { parseISO } from 'date-fns'
import { format } from 'date-fns-tz'
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/core'

import { Th, Td, Tr, Table } from '../components/Table'
import { getServices } from '../utils/db'

const Services = ({ services }) => {
  const formatted = services.map(service => {
    console.log(service.datetime)
    const parsedDate = parseISO(service.datetime)
    const timeZone = "America/Los_Angeles"
    const day = format(parsedDate, "EEEE", { timeZone: timeZone })
    const date = format(parsedDate, "MMM d", { timeZone: timeZone })
    const time = format(parsedDate, "h:mmaaaaa", { timeZone: timeZone })
    return {
      ...service,
      date: date,
      day: day,
      time: time
    }
  })
  return(
    <Box h="100vh" maxW="50rem" mx="auto">
      <Flex py="4rem" px="2rem" mx="auto" direction="column" justify="center" align="center">
        <Heading size="2xl" textAlign="center" letterSpacing="tighter" lineHeight="0.8">
          Mariners Church <br /> Livestream Analytics
        </Heading>
        <Text mt={4} textAlign="center" letterSpacing="tight" fontSize="lg">
          All services queried will be saved here for future reference.
        </Text>
        <Table my={4}>
          <thead>
            <Tr>
              <Th>Type</Th>
              <Th>Date</Th>
              <Th>Day</Th>
              <Th>Time</Th>
              <Th>Resi</Th>
              <Th>OC</Th>
              <Th>YT</Th>
              <Th>Watch</Th>
            </Tr>
          </thead>
          <tbody>
            {formatted.map(service => (
              <Tr key={service.uuid}>
                <Td>{service.type}</Td>
                <Td>{service.date}</Td>
                <Td>{service.day}</Td>
                <Td>{service.time}</Td>
                <Td>{service.viewerCount}</Td>
                <Td>{service.ocCount}</Td>
                <Td>{service.ytCount}</Td>
                <Td textAlign="center">
                  <Link href={`https://youtube.com/watch?v=${service.youtube_url}`} isExternal>
                    Link
                  </Link>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Flex>
    </Box>
  )
}

export async function getServerSideProps() {
  const services = await getServices()
  return {
    props: {
      services
    }
  }
}

export default Services
