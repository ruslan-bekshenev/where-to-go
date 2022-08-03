import { ChangeEvent, useEffect, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Input } from 'antd'
import axios from 'axios'
import SearchContainer from 'src/component/SearchContainer'

import MapboxMap from '../../component/MapboxMap'
import useDebounce from '../../util/hooks/useDebounce'

import styles from './Map.module.scss'

// export const getServerSideProps = async (context: any) => {}

export interface ICity {
  coords: [number, number]
  city: string
}

interface CityProps {
  bbox: [number, number, number, number]
  center: [number, number]
  geometry: { type: string; coordinates: [number, number] }
  id: string
  place_name: string
  place_type: string[]
  properties: { short_code: string; wikidata: string }
  relevance: number
  text: string
  type: string
  context: {
    id: string
    short_code: string
    text: string
    wikidata: string
  }[]
}
interface MapProps {
  city: CityProps
  coords: [number, number]
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { lat, lon } = query
  try {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    )
    const city = data?.features[data.features.length - 2]
    return {
      props: { city, coords: data?.query },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

const Map: NextPage<MapProps> = ({ city, coords }) => {
  console.log(coords)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const handleMapLoading = () => setLoading(false)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearch(e.target.value)
  }
  const handleGetCity = async (coords: [number, number]) => {
    // try {
    //   const { data } = await axios.get(
    //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.join(
    //       ',',
    //     )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    //   )
    //   // const {} = await axios.g
    //   return data
    // } catch (e) {
    //   console.log(e)
    // }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition((position) => {
        router.replace({
          query: {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
          },
        })
      })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Карта достопримечательностей</title>
      </Head>
      <>
        <div className={styles.appContainer}>
          <div className={styles.search}>
            <div className={styles.searchContainer}>
              <Input
                size="large"
                placeholder="Введите город"
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className={styles.mapWrapper}>
            <MapboxMap
              initialOptions={{
                center: coords,
              }}
              onMapLoaded={handleMapLoading}
              center={coords ?? [0, 0]}
            />
          </div>
          {/*{loading && <MapLoadingHolder className="loading-holder" />}*/}
        </div>
        <SearchContainer />
      </>
    </>
  )
}

export default Map
