import { ChangeEvent, useEffect, useState } from 'react'

import Head from 'next/head'

import { Input } from 'antd'

import MapboxMap from '../../component/MapboxMap'
import useDebounce from '../../util/hooks/useDebounce'

import styles from './Map.module.scss'

export const getServerSizeProps = () => {
  console.log('1')
}

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
    if (typeof window === 'undefined') return
    setTimeout(() => {
      console.log(process.env)
    }, 1000)
    console.log(process.env)
    // if (debouncedSearch) {
    //   axios
    //     .get(
    //       `${process.env.API_URL || 'http://localhost:6000/api'}/map/place/ru`,
    //       {
    //         params: { name: debouncedSearch },
    //       },
    //     )
    //     .then((data) => {
    //       console.log(data)
    //     })
    // }
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
