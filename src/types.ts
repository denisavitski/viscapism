export {}

declare global {
  var __style: string
  var __client: string

  var style: (style: JSX.Style) => void

  var client: {
    <T extends { [key: string]: any }>(callback: JSX.ClientCallback<T>): void
    <T extends { [key: string]: any }>(parameters: T, callback: JSX.ClientCallback<T>): void
  }

  var __styleFunc: (path: Parameters<typeof style>) => void
  var __clientFunc: (path: Parameters<typeof client>) => void

  namespace JSX {
    type TagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap

    type TagNames = keyof TagNameMap

    type ComponentChild = Node | string | number | boolean | undefined | null | void

    type ComponentChildren = Array<ComponentChild>

    type StyleToken = Exclude<
      Extract<keyof CSSStyleDeclaration, string> | `--${string}`,
      'length' | 'parentRule'
    >

    type StyleAttribute = Partial<{
      [K in StyleToken]: string | number
    }>

    type StyleWrapper = {
      [key: string]: object | StyleAttribute
    }

    type Style =
      | StyleAttribute
      | {
          [key: string]: StyleWrapper | StyleAttribute
        }

    type ClientCallback<T> = (args: T) => void

    type ClassObject = { [key: string]: boolean }
    type ClassArray = Array<string | null | undefined | ClassObject>

    type Class = string | ClassArray | ClassObject

    interface BaseProps {
      children?: Array<ComponentChild>
    }

    type RenderFunction<TProps extends object = object> = {
      (props?: BaseProps & TProps): ComponentChild | Promise<ComponentChild>
    }

    interface DOMAttributes {
      ref?: { current: any }
    }

    interface HTMLAttributes extends DOMAttributes {
      accept?: string
      acceptCharset?: string
      accessKey?: string
      action?: string
      allowFullScreen?: boolean
      allowTransparency?: boolean
      alt?: string
      as?: string
      async?: boolean
      autocomplete?: string
      autoComplete?: string
      autocorrect?: string
      autoCorrect?: string
      autofocus?: boolean
      autoFocus?: boolean
      autoPlay?: boolean
      capture?: boolean | string
      cellPadding?: number | string
      cellSpacing?: number | string
      charSet?: string
      challenge?: string
      checked?: boolean
      class?: Class
      cols?: number
      colSpan?: number
      content?: string
      contentEditable?: boolean
      contextMenu?: string
      controls?: boolean
      controlsList?: string
      coords?: string
      crossOrigin?: string
      data?: string
      dateTime?: string
      default?: boolean
      defer?: boolean
      dir?: 'auto' | 'rtl' | 'ltr'
      disabled?: boolean
      disableRemotePlayback?: boolean
      download?: string
      draggable?: boolean
      encType?: string
      form?: string
      formAction?: string
      formEncType?: string
      formMethod?: string
      formNoValidate?: boolean
      formTarget?: string
      frameBorder?: number | string
      headers?: string
      height?: number | string
      hidden?: boolean
      high?: number
      href?: string
      hrefLang?: string
      for?: string
      htmlFor?: string
      httpEquiv?: string
      icon?: string
      id?: string
      inputMode?: string
      integrity?: string
      is?: string
      keyParams?: string
      keyType?: string
      kind?: string
      label?: string
      lang?: string
      list?: string
      loading?: 'eager' | 'lazy'
      loop?: boolean
      low?: number
      manifest?: string
      marginHeight?: number
      marginWidth?: number
      max?: number | string
      maxLength?: number
      media?: string
      mediaGroup?: string
      method?: string
      min?: number | string
      minLength?: number
      multiple?: boolean
      muted?: boolean
      name?: string
      nonce?: string
      noValidate?: boolean
      open?: boolean
      optimum?: number
      pattern?: string
      placeholder?: string
      playsInline?: boolean
      poster?: string
      preload?: string
      radioGroup?: string
      readOnly?: boolean
      rel?: string
      required?: boolean
      role?: string
      rows?: number
      rowSpan?: number
      sandbox?: string
      scope?: string
      scoped?: boolean
      scrolling?: string
      seamless?: boolean
      selected?: boolean
      shape?: string
      size?: number
      sizes?: string
      slot?: string
      span?: number
      spellcheck?: boolean
      src?: string
      srcset?: string
      srcDoc?: string
      srcLang?: string
      srcSet?: string
      start?: number
      step?: number | string
      style?: Style
      summary?: string
      tabIndex?: number
      target?: string
      title?: string
      type?: string
      useMap?: string
      value?: string | string[] | number
      volume?: string | number
      width?: number | string
      wmode?: string
      wrap?: string

      about?: string
      datatype?: string
      inlist?: boolean
      prefix?: string
      property?: string
      resource?: string
      typeof?: string
      vocab?: string

      itemProp?: string
      itemScope?: boolean
      itemType?: string
      itemID?: string
      itemRef?: string

      shadow?: boolean
      forceSvg?: boolean

      lightChildren?: boolean
    }

    type UnknownAttributes = {
      [key: string]: any
    }

    type AllAttributes = UnknownAttributes & HTMLAttributes

    type IntrinsicElementsHTML = {
      [TKey in TagNames]?: AllAttributes
    }

    type IntrinsicElements = IntrinsicElementsHTML
  }
}
