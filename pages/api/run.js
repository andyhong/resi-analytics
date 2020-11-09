import axios from 'axios'
import { subDays, parseISO, addMinutes } from 'date-fns'
import { connectToDatabase } from '../../utils/mongo'

const cities = [
  "Aliso Viejo",
  "Anaheim",
  "Brea",
  "Buena Park",
  "Costa Mesa",
  "Cypress",
  "Dana Point",
  "Fountain Valley",
  "Fullerton",
  "Garden Grove",
  "Huntington Beach",
  "Irvine",
  "La Habra",
  "La Palma",
  "Laguna Hills",
  "Laguna Niguel",
  "Laguna Woods",
  "Lake Forest",
  "Los Alamitos",
  "Mission Viejo",
  "Newport Beach",
  "Orange",
  "Placentia",
  "Rancho Santa Margarita",
  "San Clemente",
  "San Juan Capistrano",
  "Santa Ana",
  "Seal Beach",
  "Stanton",
  "Tustin",
  "Villa Park",
  "Westminster",
  "Yorba Linda"
]

const options = {
  headers: {
    cookie: process.env.RESI_COOKIE
  }
}

const range_end = Date.now()
const range_start = subDays(Date.now(), 7)

const getServices = async () => {
  const response = await axios(`https://central.resi.io/api/v3/customers/${process.env.RESI_ID}/webevents`, options)
  const services = response.data
    .filter(service => {
    const startTime = parseISO(service.startTime)
    return startTime >= range_start
      && startTime <= range_end
      && (service.name.includes("ONLINE") || service.name.includes("1107"))
    })
    .sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime))
    .map(service => {
      const startTime = addMinutes(parseISO(service.startTime), 10)
      const youtube_url = service.simulcasts
        ? service.simulcasts[0].viewUrl.split("?v=")[1]
        : null
      return {
        uuid: service.uuid,
        name: service.name,
        type: service.name.includes("Picture") ? "BPS" : "Weekend",
        datetime: startTime,
        youtube_url: youtube_url
      }
    })
  return services
}

const getViewers = (services) => {
  return Promise.all(
    services.map(async (service) => {
      let viewers = []
      let firstRequest = true
      let offset = true
      let offsetId = null
      while (offset) {
        if (firstRequest) {
          const response = await axios(`https://central.resi.io/api/v3/customers/${process.env.RESI_ID}/webevents/${service.uuid}/export?max=500`, options)
          viewers = viewers.concat(response.data)
          firstRequest = false
          offset = response.data.length === 500 ? true : false
          offsetId = response.data.length === 500 ? response.data[response.data.length - 1].clientId : null
        } else {
          const response = await axios(`https://central.resi.io/api/v3/customers/${process.env.RESI_ID}/webevents/${service.uuid}/export?max=500&offset=${offsetId}`, options)
          viewers = viewers.concat(response.data)
          offset = response.data.length === 500
            ? true
            : false
          offsetId = response.data.length === 500
            ? response.data[response.data.length - 1].clientId
            : null
        }
      }

      const actualViewers = viewers.filter(viewer => viewer.watchTimeMinutes > 5)
      const ocViewers = actualViewers.filter(viewer => cities.includes(viewer.city))
      const totalWatchTime = actualViewers.reduce((a, b) => {
        return { watchTimeMinutes:  a.watchTimeMinutes + b.watchTimeMinutes }
      })
      const averageWatchTime = Math.round(totalWatchTime.watchTimeMinutes / actualViewers.length)

      let ytCount
      if (service.youtube_url) {
        const ytResponse = await axios(`https://www.googleapis.com/youtube/v3/videos?key=${process.env.GOOGLE_API_KEY}&part=statistics&id=${service.youtube_url}`)
        ytCount = ytResponse.data.items.length > 0 ? ytResponse.data.items[0].statistics.viewCount : 0
      } else {
        ytCount = 0
      }

      return {
        ...service,
        viewerCount: actualViewers.length,
        ocCount: ocViewers.length,
        ytCount: parseInt(ytCount),
        averageWatchTime: averageWatchTime
      }
    })
  )
}

const writeServices = async (services) => {
  const { db } = await connectToDatabase()
  return Promise.all(
    services.map(async (service) => {
      return await db.collection("services").findOneAndUpdate(
        { uuid: service.uuid },
        { $set: service },
        { upsert: true }
      )
    })
  )
}

export default async (req, res) => {
  const services = await getServices()
  const viewers = await getViewers(services)
  const write = await writeServices(viewers)
  res.status(200).json(viewers)
}
