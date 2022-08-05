/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MAPBOX_TOKEN: string
      NEXT_PUBLIC_API_URL: string
    }
  }
}
