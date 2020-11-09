import { Box, Text, Link, IconButton } from '@chakra-ui/core'
import { FiYoutube } from 'react-icons/fi'
import { parseISO } from 'date-fns'
import { format } from 'date-fns-tz'

const EventCard = ({ service }) => {

  const color = service.type === "Weekend" ? "gray.800" : "cyan.400"
  const title = service.type === "Weekend" ? "Weekend Service" : "Big Picture Show"
  const parsedDate = parseISO(service.datetime)
  const timeZone = "America/Los_Angeles"
  const day = format(parsedDate, "EEEE", { timeZone: timeZone })
  const date = format(parsedDate, "MMM d", { timeZone: timeZone })
  const time = format(parsedDate, "h:mmaaaaa", { timeZone: timeZone })

  const totalViews = service.viewerCount + service.ytCount
  const ocResiViews = Math.round(service.ocCount / service.viewerCount * 100)

  return (
    <Box
      m={2}
      p="1.5rem"
      w="20rem"
      bg={color}
      rounded="1rem"
      shadow="md"
      textAlign="left"
    >
      <Text color="white" fontSize="2xl" fontWeight="medium">
        {title}
      </Text>
      <Text mb={2} color="white" fontSize="md" fontWeight="medium">
        {`${day}, ${date} @ ${time}`}
      </Text>
      <Text color="white" fontSize="md" fontWeight="bold">
        Total: {totalViews}
      </Text>
      <Text color="white" fontSize="md" fontWeight="normal">
        Resi: {`${service.viewerCount} (${ocResiViews}% in OC)`}
      </Text>
      <Text color="white" fontSize="md" fontWeight="normal">
        YouTube: {service.ytCount}
      </Text>
      <Link href={`https://www.youtube.com/watch?v=${service.youtube_url}`} isExternal>
        <IconButton
          mt={4}
          color={color}
          icon={<FiYoutube size={20}/>}/>
      </Link>
    </Box>
  )
}

export default EventCard
