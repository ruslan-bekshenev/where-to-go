import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { dehydrate, QueryClient } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import SearchContainer from 'src/component/SearchContainer'

import MapboxMap from '../../component/MapboxMap'
import { fetchGeoname, useGeoname } from '../../hooks/useGeoname'

import { MapProps } from './types'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { name } = query

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['city', name], () =>
    fetchGeoname(name as string),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

const Map: NextPage<MapProps> = () => {
  const router = useRouter()
  const {
    query: { name },
  } = router
  const { data } = useGeoname(name as string) ?? {}
  const { geoname, places } = data ?? {}
  const [loading, setLoading] = useState(true)
  const handleMapLoading = () => setLoading(false)
  const center: [number, number] = [geoname?.lon ?? 0, geoname?.lat ?? 0]

  const handleMouseUp = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    console.log(e.lngLat)
  }

  return (
    <>
      <Head>
        <title>Карта достопримечательностей</title>
      </Head>
      <MapboxMap
        initialOptions={{
          center,
        }}
        places={places}
        onMapLoaded={handleMapLoading}
        center={center}
        onMouseUp={handleMouseUp}
      />
      {!geoname && <SearchContainer />}
    </>
  )
}

export default Map
