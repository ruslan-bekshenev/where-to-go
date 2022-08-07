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
  places: any
  onMouseUp?(e: mapboxgl.MapMouseEvent & mapboxgl.EventData): void
}

const MapboxMap = ({
  initialOptions = {},
  onCreated,
  onLoaded,
  onRemoved,
  center,
  places,
  onMouseUp,
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
        center,
        zoom: 3,
        ...initialOptions,
      })

      if (places) {
        mapboxMap.flyTo({
          center,
        })

        mapboxMap.on('load', () => {
          if (onMouseUp) {
            mapboxMap.on('mouseup', onMouseUp)
          }

          mapboxMap.addSource('earthquakes', {
            type: 'geojson',
            data: places,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
          })

          mapboxMap.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40,
              ],
            },
          })

          mapboxMap.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'earthquakes',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
          })

          mapboxMap.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 4,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          })

          mapboxMap.addSource('places', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: places,
            },
          })

          mapboxMap.addLayer({
            id: 'places',
            type: 'circle',
            source: 'places',
            paint: {
              'circle-color': '#4264fb',
              'circle-radius': 6,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          })

          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
          })

          mapboxMap.on('mouseenter', 'places', (e) => {
            mapboxMap.getCanvas().style.cursor = 'pointer'

            // @ts-ignore
            const coordinates = e.features[0].geometry.coordinates.slice()
            // @ts-ignore
            const description = e.features[0].properties.description

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
            }

            popup.setLngLat(coordinates).setHTML(description).addTo(mapboxMap)
          })

          mapboxMap.on('mouseleave', 'places', () => {
            mapboxMap.getCanvas().style.cursor = ''
            popup.remove()
          })
        })
      }

      setMap(mapboxMap)
      if (onCreated) onCreated(mapboxMap)

      if (onLoaded) mapboxMap.once('load', () => onLoaded(mapboxMap))

      return () => {
        mapboxMap.remove()
        setMap(undefined)
        if (onRemoved) onRemoved()
      }
    }
  }, [places])

  return (
    <div className={styles.appContainer}>
      <div className={styles.search}>
        <div className={styles.searchContainer}>
          <Input
            placeholder="Введите город"
            onChange={handleInput}
            value={search}
          />
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
