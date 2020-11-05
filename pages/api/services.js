import { getServices } from '../../utils/db'

export default async (req, res) => {
  const services = await getServices()
  res.status(200).json(services)
}
