export interface CityProps {
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

export interface MapProps {
  city: CityProps
  coords: [number, number]
}
