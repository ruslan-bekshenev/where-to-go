import { useEffect, useRef, useState } from 'react'

import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>
  onCreated?(map: mapboxgl.Map): void
  onLoaded?(map: mapboxgl.Map): void
  onRemoved?(): void
  onMapLoaded?: any
}

const MapboxMap = ({
  initialOptions = {},
  onCreated,
  onLoaded,
  onRemoved,
}: MapboxMapProps) => {
  const [map, setMap] = useState<mapboxgl.Map>()

  const mapNode = useRef(null)

  useEffect(() => {
    const node = mapNode.current

    if (typeof window === 'undefined' || node === null) return
    console.log(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={mapNode} style={{ width: '100%', height: '100%' }} />
}

export default MapboxMap
