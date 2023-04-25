import 'tailwindcss/tailwind.css';
import Layout from '../components/Layout';
import '../styles/globals.css';
import {CookiesProvider} from "react-cookie";

function MyApp({Component, pageProps}){
  return (
      <CookiesProvider>
          <Layout>
              <Component {...pageProps} />
          </Layout>
      </CookiesProvider>
  )
}

export default MyApp