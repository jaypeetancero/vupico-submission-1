import '@/styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import nextI18nextConfig from "../../next-i18next.config.js"

const MyApp = ({ Component, pageProps }) => (
  <Component {...pageProps} />
)

export default appWithTranslation(MyApp, nextI18nextConfig)