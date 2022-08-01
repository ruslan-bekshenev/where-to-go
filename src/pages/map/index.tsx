import { ChangeEvent, useEffect, useState } from 'react'

import Head from 'next/head'

import { Input } from 'antd'

import MapboxMap from '../../component/MapboxMap'
import useDebounce from '../../util/hooks/useDebounce'

import styles from './Map.module.scss'

export const getServerSideProps = async (context: any) => {}

const Map = () => {
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState<[number, number]>([38.0983, 55.7038])
  const handleMapLoading = () => setLoading(false)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    navigator.geolocation.getCurrentPosition((position) => {
      setCity([position.coords.longitude, position.coords.latitude])
    })
  }, [])

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
            initialOptions={{ center: city }}
            onMapLoaded={handleMapLoading}
            center={city}
          />
        </div>
        {/*{loading && <MapLoadingHolder className="loading-holder" />}*/}
      </div>
    </>
  )
}

export default Map
