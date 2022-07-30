import React, { ChangeEvent, useEffect, useState } from 'react'

import Head from 'next/head'

import { Input } from 'antd'
import axios from 'axios'

import MapboxMap from '../../component/MapboxMap'
import useDebounce from '../../util/hooks/useDebounce'

import styles from './Map.module.scss'

const Map = () => {
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState([38.0983, 55.7038])
  const handleMapLoading = () => setLoading(false)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/map/place/ru`, {
        params: { name: debouncedSearch },
      })
      .then((data) => {
        console.log(data)
      })
  }, [debouncedSearch])
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
            initialOptions={{ center: [38.0983, 55.7038] }}
            onMapLoaded={handleMapLoading}
          />
        </div>
        {/*{loading && <MapLoadingHolder className="loading-holder" />}*/}
      </div>
    </>
  )
}

export default Map
