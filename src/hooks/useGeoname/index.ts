import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchGeoname = async (name?: string) => {
  try {
    if (!name) {
      return
    }
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/map/geoname`,
      {
        params: { name },
      },
    )
    return data
  } catch (e: any) {
    console.error(e.response.message)
  }
}

const useGeoname = (name?: string) => {
  return useQuery(['posts', name], () => fetchGeoname(name))
}

export { fetchGeoname, useGeoname }
