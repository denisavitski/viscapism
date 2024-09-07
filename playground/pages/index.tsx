import { Button } from '@components/Button'
import { Layout } from '@components/Layout'

export const Page: JSX.RenderFunction = () => {
  client(() => {
    console.log('HOME')
  })

  return (
    <Layout>
      <h1>HOME</h1>
      <Button client={{ color: 'red', id: 'button-1', logValue: 'button 1' }}>button 1</Button>
      <Button client={{ color: 'blue', id: 'button-2', logValue: 'button 2' }}>button 2</Button>
      <Button client={{ color: 'green', id: 'button-3', logValue: 'button 3' }}>button 3</Button>
    </Layout>
  )
}
