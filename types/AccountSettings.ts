import Entity from './Entity'

interface AccountSettings extends Entity {
  accountId: string
  currency: string
}

export default AccountSettings
