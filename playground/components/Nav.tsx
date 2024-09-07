export const Nav: JSX.RenderFunction = () => {
  style({
    '.nav': {
      position: 'fixed',
      top: '0',
      left: '0',

      display: 'flex',
      gap: '0.5rem',
    },

    '.nav__link': {},
  })

  return (
    <nav class="nav">
      <a
        class="nav__link"
        href="/"
      >
        HOME
      </a>
      <a
        class="nav__link"
        href="/about"
      >
        ABOUT
      </a>
    </nav>
  )
}
