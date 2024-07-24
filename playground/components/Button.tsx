export const Button: JSX.RenderFunction<{ client: { logValue: string; id: string } }> = (props) => {
  style({
    button: {
      color: 'blue',
    },
  })

  client(props!.client, (server) => {
    if (server.id) {
      const button = document.getElementById(server.id)

      button?.addEventListener('click', () => {
        console.log(server.logValue)
      })
    }
  })

  return <button id={props?.client.id}>{props?.children || 1111}</button>
}
