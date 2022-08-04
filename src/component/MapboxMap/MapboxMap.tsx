import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'

import { Button, Input } from 'antd'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import styles from '../../pages/map/Map.module.scss'

export interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>
  onCreated?(map: mapboxgl.Map): void
  onLoaded?(map: mapboxgl.Map): void
  onRemoved?(): void
  onMapLoaded?: any
  center?: [number, number]
}

const MapboxMap = ({
  initialOptions = {},
  onCreated,
  onLoaded,
  onRemoved,
  center,
}: MapboxMapProps) => {
  const router = useRouter()
  const [search, setSearch] = useState(router.query.name ?? '')
  const [map, setMap] = useState<mapboxgl.Map>()

  const mapNode = useRef(null)

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSearch = () => {
    router.replace({
      query: { name: search },
    })
  }

  useEffect(() => {
    const node = mapNode.current

    if (typeof window !== 'undefined' && node) {
      const mapboxMap = new mapboxgl.Map({
        container: node,
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 11,
        ...initialOptions,
      })

      setMap(mapboxMap)
      if (onCreated) onCreated(mapboxMap)

      if (onLoaded) mapboxMap.once('load', () => onLoaded(mapboxMap))

      return () => {
        mapboxMap.remove()
        setMap(undefined)
        if (onRemoved) onRemoved()
      }
    }
  }, [])

  useEffect(() => {
    if (map) {
      map.flyTo({
        center,
      })
    }
  }, [map, center])

  return (
    <div className={styles.appContainer}>
      <div className={styles.search}>
        <div className={styles.searchContainer}>
          <Input placeholder="Введите город" onChange={handleInput} />
          <Button type="primary" onClick={handleSearch}>
            Найти
          </Button>
        </div>
      </div>
      <div className={styles.mapWrapper}>
        <div ref={mapNode} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

export default MapboxMap
