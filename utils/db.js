import { connectToDatabase } from './mongo'

export async function getServices() {
  const { db } = await connectToDatabase()
  const services = await db.collection("services").find().toArray()
  return services.map(service => {
    return {
      uuid: service.uuid,
      name: service.name,
      type: service.type
    }
  })
}
