import { Button } from '@components/Button'

export const Page: JSX.RenderFunction = () => {
  style({
    '*': {
      color: 'red',
    },
  })

  return (
    <>
      <Button
        client={{
          id: 'button-1',
          logValue: '1',
        }}
      >
        123
      </Button>
      <Button
        client={{
          id: 'button-2',
          logValue: '2',
        }}
      >
        123
      </Button>
      <Button
        client={{
          id: 'button-3',
          logValue: '3',
        }}
      >
        123
      </Button>
    </>
  )
}
