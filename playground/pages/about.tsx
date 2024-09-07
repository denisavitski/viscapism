import { Layout } from '@components/Layout'

export const Page: JSX.RenderFunction = () => {
  client(() => {
    console.log('ABOUT')
  })

  return (
    <Layout>
      <h1>About</h1>
    </Layout>
  )
}
