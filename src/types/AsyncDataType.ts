export interface AsyncDataProps<T> {
  loaded: boolean
  data?: T
  error?: object
}

export type MnemonicPhraseType = [
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

export default AsyncDataProps
