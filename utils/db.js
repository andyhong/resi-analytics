import { connectToDatabase } from './mongo'

export async function getServices() {
  const { db } = await connectToDatabase()
  const services = await db.collection("services").find().toArray()
  return services.map(service => {
    return {
      uuid: service.uuid,
      name: service.name,
      type: service.type,
      datetime: service.datetime.toISOString(),
      youtube_url: service.youtube_url,
      viewerCount: service.viewerCount,
      ocCount: service.ocCount,
      ytCount: service.ytCount,
      averageWatchTime: service.averageWatchTime
    }
  })
}
