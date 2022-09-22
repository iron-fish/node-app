export interface Account {
  identity: string
  name: string
  address: string
  //Next fields can be moved in separate entity and method for getting
  balance: number
  pending: number
}

export interface AccountSettings {
  accountId: string
  currency: string
}

export interface AccountKeys {
  accountId: string
  spendingKey: string
  mnemonicPhrase: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ]
  nullifierKey: string
  authorizationKey: string
  proofAuthorizationKey: string
}
