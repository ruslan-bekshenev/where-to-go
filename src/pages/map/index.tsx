import React from 'react'

import Head from 'next/head'

import MapboxMap from '../../component/MapboxMap'

import styles from './Map.module.scss'

const Map = () => {
  const [loading, setLoading] = React.useState(true)
  const handleMapLoading = () => setLoading(false)

  return (
    <>
      <Head>
        <title>Using mapbox-gl with React and Next.js</title>
      </Head>
      <div className={styles.appContainer}>
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
