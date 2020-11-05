import { Box, Text, Link, IconButton } from '@chakra-ui/core'
import { FiYoutube } from 'react-icons/fi'
import { parse, format } from 'date-fns'

const EventCard = ({ service }) => {

  const color = service.type === "Weekend" ? "gray.800" : "cyan.500"
  const title = service.type === "Weekend" ? "Weekend Service" : "Big Picture Show"
  const parsedDate = parse(service.date, "yyyy-MM-dd", new Date())
  const date = format(parsedDate, "MMM d")

  return (
    <Box
      m={2}
      p="1.5rem"
      w="20rem"
      bg={color}
      rounded="1rem"
      textAlign="left"
    >
      <Text color="white" fontSize="2xl" fontWeight="medium">
        {title}
      </Text>
      <Text mb={2} color="white" fontSize="md" fontWeight="medium">
        {service.day}, {date} @ {service.time}
      </Text>
      <Text color="white" fontSize="md" fontWeight="normal">
        Viewers: {service.viewerCount}
      </Text>
      <Text color="white" fontSize="md" fontWeight="normal">
        OC Viewers: {service.ocCount}
      </Text>
      <Text color="white" fontSize="md" fontWeight="normal">
        Youtube Viewers: {service.ytCount}
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
