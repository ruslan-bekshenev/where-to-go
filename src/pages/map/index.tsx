import { ChangeEvent, useEffect, useState } from 'react'

import Head from 'next/head'

import { Input } from 'antd'
import axios from 'axios'

import MapboxMap from '../../component/MapboxMap'
import useDebounce from '../../util/hooks/useDebounce'

import styles from './Map.module.scss'

// export const getServerSideProps = async (context: any) => {}

export interface ICity {
  coords: [number, number]
  city: string
}

const Map = () => {
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState<ICity | null>()
  const handleMapLoading = () => setLoading(false)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  const handleGetCity = async (coords: [number, number]) => {
    try {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.join(
          ',',
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
      )
      setCity({ coords, city: data?.features[data.features.length - 2]?.text })
      // const {} = await axios.g
      return data
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (typeof window === 'undefined') return
    navigator.geolocation.getCurrentPosition((position) => {
      handleGetCity([position.coords.longitude, position.coords.latitude])
    })
  }, [])

  useEffect(() => {
    console.log(city)
  }, [city])

  return (
    <>
      <Head>
        <title>Using mapbox-gl with React and Next.js</title>
      </Head>
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
            initialOptions={{ center: city?.coords }}
            onMapLoaded={handleMapLoading}
            center={city?.coords ?? [0, 0]}
          />
        </div>
        {/*{loading && <MapLoadingHolder className="loading-holder" />}*/}
      </div>
    </>
  )
}

export default Map
