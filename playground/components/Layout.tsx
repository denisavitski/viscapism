import { Nav } from './Nav'

export const Layout: JSX.RenderFunction = (props) => {
  style({
    '.main': {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

  return (
    <>
      <head>
        <title>123</title>
      </head>

      <Nav></Nav>

      <div class="main">{props?.children}</div>
    </>
  )
}
