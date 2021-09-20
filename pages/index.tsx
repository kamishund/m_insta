import Auth from '../components/Auth'
import Layout from '../components/Layout'
import ApiContextProvider from '../context/apiContext'
export default function Home() {
  return (
    <ApiContextProvider>
      <Layout>
        <Auth />
      </Layout>
    </ApiContextProvider>
  )
}
