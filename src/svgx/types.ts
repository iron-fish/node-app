import * as CSS from 'csstype'

export interface Styled {
  style?: CSS.Properties
}

export interface SVGProps extends Styled {
  fill?: string
  stroke?: string
}
