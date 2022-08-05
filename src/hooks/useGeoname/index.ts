import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { IGeoname } from './types'

const fetchGeoname = async (name?: string) => {
  try {
    if (!name) {
      return
    }

    const { data: geoname } = await axios.get<IGeoname>(
      `${process.env.NEXT_PUBLIC_API_URL}/map/geoname`,
      {
        params: { name },
      },
    )

    const { data: places } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/map/radius`,
      {
        params: {
          radius: 32000,
          lon: geoname.lon,
          lat: geoname.lat,
          format: 'json',
        },
      },
    )

    const placesAdapter = places.map((place: any) => ({
      type: 'Feature',
      properties: {
        description: place.name,
      },
      geometry: {
        type: 'Point',
        coordinates: [place.point.lon, place.point.lat],
      },
    }))
    return { geoname, places: placesAdapter }
  } catch (e: any) {
    console.error(e.response.message)
  }
}

const useGeoname = (name?: string) => {
  return useQuery(['city', name], () => fetchGeoname(name))
}

export { fetchGeoname, useGeoname }
