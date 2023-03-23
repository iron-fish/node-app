import Entity from './Entity'

interface Contact extends Entity {
  name: string
  address: string
  order?: number
}

export default Contact
