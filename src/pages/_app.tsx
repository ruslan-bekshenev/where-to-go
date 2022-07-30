import type { AppProps } from 'next/app'

import '../styles/globals.css'

import Layout from '../component/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
