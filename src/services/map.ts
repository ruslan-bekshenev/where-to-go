import axios from 'axios'

class MapService {
  static async geoname(name: string) {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/map/geoname`,
        {
          params: { name },
        },
      )
      const city = data?.features[data.features.length - 2]
      return { city, coords: data?.query }
    } catch (e: any) {
      console.error(e.response.message)
    }
  }
}

export default MapService
