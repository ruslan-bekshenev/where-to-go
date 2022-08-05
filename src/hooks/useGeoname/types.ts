export interface IPlacesParams {
  radius: number
  limit?: number
  offset?: number
  lon: number
  lat: number
  rate: number
  format: 'count' | 'json'
}

export interface IGeoname {
  country: string
  lat: number
  lon: number
  name: string
  population: number
  status: string
  timezone: string
}
