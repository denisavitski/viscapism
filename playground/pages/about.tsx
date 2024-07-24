import { Layout } from '@components/Layout'

export const Page: JSX.RenderFunction = () => {
  style({
    '*': {
      color: 'orange',
    },
  })

  client(() => {
    console.log('ABOUT')
  })

  return (
    <Layout>
      <h1>About</h1>
    </Layout>
  )
}
